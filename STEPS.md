# DEMO STEPS

## (Introduction)

- Thanks for the introduction
- Aurora, I'm a web dev in norway, and I work as consultant at Inmeta in Oslo
- I'm super excited to be here to be speaking here today, and I will be demoing a practical example on working with forms and react server components.
- Going to code a simplified version of something i’ve built for my customer project, where im actively using React Server Components, and it's working well for us.

## Setup and starting point

- I'm here in the Next.js App router, prisma as ORM and local DB, tailwind CSS.
- Since I'm in the App Router, everything is a server component my default.
- Message box is a server component, will never run on the client, and it can be async component and asynchronously fetching messages, map to message display, and a message input.
- This is now only server components, but what I'm doing here can be done with client apps with a little more work to create endpoints. No js on the client for any of these components.
- Lets enhance this message box with rsc and react 19! Goal: make it interactive while minimizing js on the client and reducing frontend complexity.

## Make the MessageInput form work with an action

- Lets start with the basic functionality. Make the form work.
- Attach action prop using React 19s extension of the form element, bind to a function, in this case a server function. When called with a function, behaves differently than native form, can be called without js.
- This could be an action on the client, but since we're using server components, we can pass a server function instead. Function auto wrapped in transition.
- Create submitMessage server function, data access layer /actions. Define server functions with "use server", allowing the functions inside this file to be "exposed to the client" and call server code from the client, next.js essentially creates a hidden API endpoint for the functions in this file.
- Takes in type formData, what this means is that each field will be submitted with its value inside this formData object. Get by name.
- Submit to db, type "as string", leave "createdById", add hidden userId field. Mention .bind as an way to pass additional props.
- Disclaimer: Don't pass userId from the client, this is an example, server-side auth setup
- Submit, refresh page, revalidatePath purge cache and regenerate all server components for this page, submit again.
- Just by doing that we can submit the form to the backend, just using native forms, no mess with api endpoints and preventDefault. Had we used the onSubmit we would need React to have hydrated this page to be able to submit the form.

## Add scroll handler in AutomaticScroller

- Did you notice, I'm stuck in this scroll position, I can't see the new messages.
- To fix that, messageBox, replace with automaticscoller
- Client component with effect, scroll bottom new child. Clearly client, since its using children (could be any other prop), we can put server comp inside without converting them. Only the js fro the scroll handler is shipped.
- Try it out, scroll. Check devtools: new update to devtools just recently, we can actually see server components in the devtools. Only the scroller is client.

## Validate data in submitMessage

- Next thing, validate our data, client side untrusted input.
- validate as result, safeParse with messageSchema, add object from the db insert into the safeParse
- Show messageSchema, explain zod runtime validator, check our object is following rules, remove "as string"
- If result failed, throw error "invalid message data"
- Comment out client side validation, invalid message, get error thrown
- Handle errors different ways, here use error boundary around message input, if there is error, it's caught and shown in the error boundary.
- But back client side validation

## Return validation instead of throw

- I don't want to throw error, I want to return success and the error, and timestamp, see later. Create timestamp.
- Something else on the server: query db, whatever.
- Check messages for user, if more than 5, return error "user has reached the message limit" + timestamp and success false
- You can also return the errors for each field to display in the form, but I only have one input field here
- Otherwise, insert db, if it fails, errors boundary can handle
- Return success true
- I have server side logic, get it to the message input and to the user: useActionState, takes in a function to call, the action, submitMessage, and initial state. Returns generated component state, equal first initial state and after that, the last returned value of the action that useActionState is wrapping. Also get a wrapped action, submitMessageAction by convention. Can be return without js.
- Render the error in the form.
- Problem: tell bundler to load client side js with "use client".
- Also typescript: The action useActionState is wrapping will also receive and additional argument, _prevState
- Test out until we hit max message count after 3, hit max message, error is returned and rendered.

## Add interactivity, toast message count

- Rather use a toast, feel better, more interactive.
- useEffect to toast on error, depend on timestamp and error, dependencies + timestamp, rerun whenever timestamp or error changes.
- Submit, see toast and error message.
- I no longer need the error text. Leave it as a noscript fallback.
- Try, no more error.

## Return content for rollback on reset

- On an error, my form resets.
- The reason is that in React 19, when using uncontrolled inputs and form action, the form automatically resets after the action finishes. Good because it follows the mpa form submission behavior. But here, we want to maintain the entered value when there is an error.
- Probably used to using a library that would create a controlled form state, like react-hook-form or formik. Not needed, this is uncontrolled.
- In this case, I don't want to reset the form. Maintain the entered value when there is error. Maybe this could be changed to be valid. Let's return the content and set it as the defaultValue so it's not lost.
- When the state returns with an error, it will be the defaultValue, pretty nice.

## Slow server action

- One more thing. Make it more realistic. Im using local db, the round trip could take a while.
- Add slow() to server function. See how it feels, not seeing instant feedback, hitting button multiple times.
- UseActionState return third value, isPending. Pending state of the action. Use it to disable button and say "sending...".
- Demo, seeing loading state.
- Increase max messages to 8 and demo again, working again, pending and reset, and scroll.
- No hassle like in the pages router with handling errors and loading states

## Showcase form without JS

- Whats interesting, this whole form works without js! Turn off js.
- Add one "no javascript", we didn't get automatic scrolling or button feedback, and a full page refresh, because all that requires js on the client. But everything worked.
- Demo without js until it fails. "still no js", "no js".
- Hit max messages, "user has reached the message limit", noscript fallback.
- Turn js back on, reload page, and show the feedback.

## Explanation

- What we've been doing is progressively enhancing this, meaning ensuring the basic functionality works at the lowest level of resources, no javascript, then adding things on top to enhance the user experience for users with those resources available.
- Lets say your user is on a slow device or slow connection and still waiting for js to finish downloading, parsing, or executing. This will work before its loaded, and will make the hydration for the JS that we do want load faster, because we reduced the amount of js on the client weaving the server component and the client together. Now depending on the user’s situation, they will get the better experience, and always have a form that works.

## Replace with submitButton

- Let's talk about the reusability, what if I want this same pattern other places in my app. IsPending is nice, not resuable. Maybe I'm not even using useActionState. Extract this logic to a submitButton component. Cut and paste the button, leave SubmitButton. "Send".
- Paste as ui/SubmitButton.
- Somehow get the pending value from somewhere else. Another react 19 hook: useFormStatus. Returns the data, pending, action, method. All comes from the parent form, using it as a provider. Use pending in the submitButton.
- Add "use client" to use this hook for client side interactivity
- If its pending, return a styled div with a spinner and the children, otherwise children.
- You can generalize more and extend the button element, and add a additional loading prop for triggering it in multiple ways.
- Test the button. Spinning. The real key: thrown into any component, even server component. Add to MessageBox.
- New form with action, resetMessages, inline server action for efficiency: "use server", slow, deleteMany, revalidate
- Handling its own pending state even from the server, button is completely composable. Pretty amazing. Power of RSC.

## Optimistic update

- One more thing to show. Stash current code, switch branch
- I have been progressively enhancing it further. I added a "messages",  getting the messages from the server.
- Client component, use react 19 useOptimistic. Takes in a state to show action is pending, and an update function or reducer function, defining how to do the optimistic update. In this case, adding isSending:true to the optimistic messages.
- Returns optimistic messages, and a function to trigger it. Passing this to the MessageInput.
- Added another progressive enhancement with an onSubmit, leaving the previous action as a fallback. So if the form is hydrated by js, we will trigger the optimistic update. In onsubmit, trigger the optimistic update, reset form maintain default value.
- Now when I use this, add "optimistic", im getting optimistic update, displaying sending while the action is pending. This is the client state, as the server returns with the "truth" it will throw away the client state and settle to the server state.
- Send multiple messages, then many until it fails. Whatever doesn't exist on the server is removed because it's only temporary client state that doesn't exist on the server.

Note: Why do I need transition: handle errors safely, keep UI responsive, mark as non-urgent, “server actions should be called inside transitions”, “optimisticUI should be called inside transitions” so that the useOptimistic can know the state of the action, useOptimistic now will trigger immediately Opt out of the transition with useOptimistic.

## Bottom line

Of course, depending on your app you can decide how to implement forms and whether you still want your react-hook form and whatnot, but React now provides another option, by using the the more primitive features of the web together with React 19 and React Server Components, we can make our forms very robust and while maintaining a great user experience. And there is a lot more to come from these. They will be primitives for libraries simplifying things for developers, focus on building apps.

## (Conclusion)

That's it for this demo, the code is pinned on my GitHub and the optimistic update is on a branch, and follow me on Twitter if you are interested in more rsc content. Thanks for listening and thanks React Universe Conf!
