import React, { lazy } from 'react';
import { createBrowserRouter } from "react-router-dom";

const DropzoneUploader = lazy(() => import('../component/DropzoneUploader.js'));

const Router = createBrowserRouter([
    {
        path: "/dropzone-uploader",
        element: <DropzoneUploader/>,
    },
]);

export default Router;
