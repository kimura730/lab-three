import React from 'react'
import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css'
import { presignedPut } from '../service/s3';

// file path and file name to be uploaded to the s3 bucket
const getBannerFilename = (username) => {
    return `assets/${username}/banner.png`;
};

const getS3UploadUrl = async () => {
    return await presignedPut(getBannerFilename('s3-demo'));
};

const Layout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
    return (
        <div style={{ margin: 0, padding: 0 }}>
            {previews}

            {previews?.length == 0 && <div {...dropzoneProps}>{files.length < maxFiles && input}</div>}

            {files.length > 0 && submitButton}
        </div>
    )
};

const DropzoneUploader = (props) => {
    const getUploadParams = async ({ file, meta }) => ({
        method: 'PUT',
        url: await getS3UploadUrl(),
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
                alert(`File uploaded to ${process.env.REACT_APP_S3_ENDPOINT}/${process.env.REACT_APP_S3_BUCKET}/${getBannerFilename('s3-demo')}, please reload`);
                break;
            default:
                break;
        }
    };

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
            <div style={{ marginBottom: 5, minHeight: 200, background: `no-repeat 50% 50%/cover url("${process.env.REACT_APP_S3_ENDPOINT}/${process.env.REACT_APP_S3_BUCKET}/${getBannerFilename('s3-demo')}")` }}>
            </div>
        </>
    )
}

export default DropzoneUploader