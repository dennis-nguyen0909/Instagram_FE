import { Skeleton } from 'antd';
import React from 'react';

export const SkeletonComponent = ({ isLoading, children }) => {
    return (
        <>
            {isLoading
                ? <Skeleton active />
                : <>{children}</>}
        </>
    );
};