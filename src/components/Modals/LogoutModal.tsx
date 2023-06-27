import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import supabase from '../../supabase';
import logoutIcon from '../../assets/icons/log-out.png';
import { useNavigate } from 'react-router-dom';

export default function LogoutModal() {
    const navigate = useNavigate();
    const logout = async () => {
        supabase.auth.signOut();
        navigate('/');
    };

    const [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            <div className="font-circular ">
                <div className="h-fit mx-auto">
                    <button onClick={openModal} className=" px-5 pr-10 sm:pr-6 rounded-md py-3 border border-gray-300 space-x-1 flex items-center shadow shadow-[0px_1px_1px_0px_rgba(203,200,212,0.35)">
                        <span className="text-gray-500">Logout</span>
                        <img className="w-5" src={logoutIcon} alt="" />
                    </button>
                </div>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="font-circular relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-center text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Are you sure you want to log out?
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        
                                    </div>

                                    <div className="flex justify-between mt-8">
                                        <button
                                            type="button"
                                            className="transition-all inline-flex justify-center rounded-md border border-gray-200 bg-transparent px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="transition-all inline-flex justify-center rounded-md border border-transparent bg-red-100 px-8 py-3 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={logout}
                                        >
                                            Yes, log out
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
