const QRCode = ({ shortUrl }: { shortUrl: string }) => {
    const downloadQRCode = async () => {
        const qrCodeImageUrl = `http://api.qrserver.com/v1/create-qr-code/?data=${shortUrl}&size=100x100.png`;

        try {
            // Fetch the image data as a Blob
            const response = await fetch(qrCodeImageUrl);
            const blob = await response.blob();

            // Create a temporary URL for the Blob object
            const url = URL.createObjectURL(blob);

            // Create a temporary <a> element
            const link = document.createElement('a');
            link.href = url;
            link.download = 'qr-code.png'; // Specify the filename for the downloaded file

            // Programmatically trigger the click event on the <a> element
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Revoke the temporary URL to free up memory
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading QR code:', error);
            // Handle the error case
        }
    };

    return (
        <div className='py-8 px-6 bg-gray-50 border-y'>
            <h1 className='text-xl font-medium'>QR code</h1>
            <div className='flex flex-col sm:flex-row md:flex-col lg:flex-row my-6 gap-4'>
                <div className='p-2 h-fit rounded-md bg-white max-w-xs mx-auto'>
                    <img className='object-cover w-[250px] rounded-md bg-white' src={`http://api.qrserver.com/v1/create-qr-code/?data=${shortUrl}&size=100x100`} alt='' />
                </div>
                <div className='flex flex-col w-full'>
                    <span className='text-gray-600 text-lg max-w-xs'>People can scan this QR code to access your link</span>
                    <span className='text-gray-600 text-lg my-2'>Download now to share</span>
                    <button onClick={downloadQRCode} className='flex w-fit px-5 py-3 lg:my-4 rounded-md text-gray-500 border border-gray-300 bg-gray-100 shadow-[0px_1px_1px_0px_rgba(203,200,212,0.35),0px_1px_1px_1px_#FFF_inset]'>
                        <span className='mr-2'>Download PNG</span>
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3' />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRCode;
