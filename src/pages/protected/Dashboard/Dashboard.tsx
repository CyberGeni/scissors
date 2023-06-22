import filterIcon from '../../../assets/icons/filter.png';
import eye from '../../../assets/icons/eye.png';
const Dashboard: React.FC = () => {
      
    return (
        <>
            <section>
                {/* links section */}
                <div className="fixed w-full sm:w-1/4 border-r border-gray-200 min-h-screen">
                    {/* link header */}
                    <div className="px-6 py-4 bg-gray-50 w-full flex items-center justify-between">
                        <h3>All links</h3>
                        <div className='flex rounded-md border border-gray-100 items-center bg-white space-x-2 px-5 py-3 shadow-[1px_1px_2px_0px_rgba(203,203,209,0.29)]'>
                            <span className='text-gray-500'>Sort by</span>
                            <img className='w-5 h-5' src={filterIcon} alt="" />
                        </div>
                    </div>
                    {/* list of links */}
                    <div>
                        {/* single link */}
                        <div className='flex items-center justify-between px-6 py-4 border-y border-gray-200 '>
                            {/* text */}
                            <div className='tracking-tight flex flex-col w-full'>
                                <span className='text-gray-700 text-lg font-medium tracking-tighter mb-0.5'>https://shortenedurl.com</span>
                                <span className='text-gray-600'>https://originalurl.com</span>
                                <span className='text-gray-600'>My portfolio</span>
                            </div>
                            {/* views */}
                            <div className='flex flex-col items-center -space-y-0.5'>
                                <span className='text-gray-500 font-medium'>123</span>
                                <img className='w-5' src={eye} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>

                </div>
            </section>
        </>
    )
}
export default Dashboard;