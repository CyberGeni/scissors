import { Disclosure, Transition } from '@headlessui/react'

export default function FAQs() {
    return (
        <div className="w-full px-4 pt-16">
            <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
                <Disclosure>
                    {() => (
                        <>
                            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                <span>What is your refund policy?</span>

                            </Disclosure.Button>
                            <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                            >
                                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                    If you're unhappy with your purchase for any reason, email us
                                    within 90 days and we'll refund you in full, no questions asked.
                                </Disclosure.Panel></Transition>
                        </>
                    )}
                </Disclosure>
                <Disclosure as="div" className="mt-2">
                    {() => (
                        <>
                            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                <span>Do you offer technical support?</span>

                            </Disclosure.Button>
                            <Disclosure.Button>Is team pricing available?</Disclosure.Button>

                            <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                            >
                                <Disclosure.Panel>
                                    Yes! You can purchase a license that you can share with your entire
                                    team.
                                </Disclosure.Panel>
                            </Transition>
                        </>
                    )}
                </Disclosure>
            </div>
        </div>
    )
}
