import React, { useState } from 'react'
import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css'
import { presignedPut } from '../service/s3';
import { v4 as uuidv4 } from 'uuid';

const Layout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
    return (
        <div style={{ margin: 0, padding: 0 }}>
            {previews}

            {previews?.length === 0 && <div {...dropzoneProps}>{files.length < maxFiles && input}</div>}

            {files.length > 0 && submitButton}
        </div>
    )
};

const DropzoneUploader = (props) => {
    const [path, setPath] = useState(null);
    const [imageUrl, setImageUrl] = useState();

    const getUploadParams = async ({ file, meta }) => ({
        method: 'PUT',
        url: await getS3UploadUrl(file.name),
        body: file
    });

    const handleChange = ({ meta, file }, status) => {
        console.log(status, meta, file);
        switch (status) {
            case 'preparing':
                break;
            case 'getting_upload_params':
                break;
            case 'done':
                alert(`File uploaded to ${process.env.REACT_APP_S3_ENDPOINT}/${process.env.REACT_APP_S3_BUCKET}/${path}`);
                break;
            default:
                break;
        }
    };

    const handleFilename = (filename) => {
        const regex = /^(.+)\.([^\.]+)$/;
        const match = filename.match(regex);
        if (match) {
            const mainFilename = match[1];
            const subFilename = match[2];
            const regex = /[^a-zA-Z0-9_\-()+&*^\"\'\[\]]/g;
            const editedMainFilename = mainFilename.replace(regex, "");
            if (editedMainFilename.length > 0) {
                return editedMainFilename + "." + subFilename;
            } else {
                return "noroot." + subFilename;
            }
        } else {
            return "Invalid filename format.";
        }
    };

    // file path and file name to be uploaded to the s3 bucket
    const handledPath = (filename) => {
        const handledFilename = handleFilename(filename);
        const uuid = uuidv4();
        const path = `${uuid}/${handledFilename}`
        setPath(path);
        return path;
    };

    const getS3UploadUrl = async (filename) => {
        return await presignedPut(handledPath(filename));
    };

    const displayImage = (e) => {
        const { value } = e.target;
        // const url = `${process.env.REACT_APP_S3_ENDPOINT}/${process.env.REACT_APP_S3_BUCKET}/${value}`;
        setImageUrl(value);
    }

    return (
        <>
            <div>DropzoneUploader</div>
            <Dropzone
                getUploadParams={getUploadParams}
                // onSubmit={handleSubmit}
                onChangeStatus={handleChange}
                submitButtonContent={null}
                maxFiles={1}
                submitButtonDisabled={true}
                multiple={false}
                LayoutComponent={Layout}
                accept="image/*"
                styles={{ dropzone: { minHeight: 120 } }} />
            <input type='text' name='url' onChange={displayImage} style={{width:'100%'}}/>
            {imageUrl && (
                <div style={{ marginBottom: 5, minHeight: 200, background: `no-repeat 50% 50%/cover url("${imageUrl}"` }}>
                </div>
            )}
        </>
    )
}

export default DropzoneUploader