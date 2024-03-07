import React from 'react';

interface Props {
    clickSource: (string | null)[];
}

const TopClickSource: React.FC<Props> = ({ clickSource }) => {

    // convert the links to app names 
    const convertedLinks = clickSource?.map((link) => {
        if (link === "https://btchr.netlify.app/") {
            return "Dashboard";
        } else if (link === "https://t.co/" || link?.includes("twitter")) {
            return "Twitter";
        } else if (link === "android-app://com.google.android.googlequicksearchbox") {
            return "Google Lens";
        } else if (link === "https://news.google.com/") {
            return "Google News";
        } else if (link?.includes("slack")) {
            return "Slack";
        } else if (link?.includes("pinterest")) {
            return "Pinterest";
        } else if (link === "android-app://com.linkedin.android/" || link === "https://www.linkedin.com/") {
            return "LinkedIn";
        } else if (link?.includes("facebook")) {
            return "Facebook";
        } else if (link === "https://mail.google.com/" || link === "android-app://com.google.android.gm/") {
            return "Gmail";
        } else if (link?.includes("github")) {
            return "GitHub";
        } else if (link === "http://instagram.com/") {
            return "Instagram";
        } else if (link?.includes("linkedin")) {
            return "LinkedIn";
        } else if (link?.includes("localhost")) {
            return "Localhost";
        } else if (link === "") {
            return "Direct links";
        } else {
            return "Other";
        }
    });

    // Count occurrences of each app
    const count = convertedLinks?.reduce((acc, app) => {
        acc[app] = (acc[app] || 0) + 1;
        return acc;
    }, {});

    // Find the most common app
    let mostCommonApp = null;
    let maxCount = 0;

    for (const app in count) {
        if (count[app] > maxCount) {
            mostCommonApp = app;
            maxCount = count[app];
        }
    }

    return (
        <div className='bg-white rounded-md shadow p-6 space-y-6'>
            <div className='flex justify-between text-gray-500'>
                <span className='font-medium tracking-tight'>Top click source</span>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
            </div>
            <h1 className='text-3xl font-bold'>{mostCommonApp || 'No data'}</h1>
        </div>
    );
};

export default TopClickSource;
