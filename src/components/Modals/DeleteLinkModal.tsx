import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import supabase from '../../supabase';
interface Link {
    id: string;
    url: string;
    original_url: string;
    short_url: string;
    name: string;
    linkName: string;
    identifier: string;
    customIdentifier: string;
    // Add other properties as needed
}

type ModalProps = {
    selectedLink: Link | null;
};
export default function DeleteLinkModal({ selectedLink }: ModalProps) {
    const [deleteText, setDeleteText] = useState('Delete')
    const deleteLink = async () => {
        if (selectedLink) {
            setDeleteText('Deleting...')
            const { data, error } = await supabase
                .from('links')
                .delete()
                .eq('id', selectedLink?.id)
                console.log(data, error)
                if (data === null) {
                    setDeleteText('Deleted!')
                    setTimeout(() => {
                        window.location.reload()
                        closeModal()
                    }, 1000)
                }
        }
    }

    const [isOpen, setIsOpen] = useState(false)
    function closeModal() {
        setIsOpen(false)
    }
    function openModal() {
        setIsOpen(true)
    }
    return (
        <>
            <div className="flex items-center justify-center">
                <button
                    type="button"
                    onClick={openModal}
                    className="w-full space-x-1 flex items-center rounded-md text-red-500 px-4 py-3 text-sm font-medium hover:bg-gray-100 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span>Delete</span>
                </button>
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 text-center"
                                    >
                                        Are you sure you want to delete this link?
                                    </Dialog.Title>
                                    <div className="flex justify-between mt-6">
                                        <button
                                            type="button"
                                            className="transition-all inline-flex justify-center rounded-md border border-gray-200 bg-transparent px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="transition-all inline-flex justify-center rounded-md border border-transparent bg-red-500 hover:bg-red-700 px-8 py-3 text-sm font-medium text-white focus:outline-none"
                                            onClick={deleteLink}
                                        >
                                            {deleteText}
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
