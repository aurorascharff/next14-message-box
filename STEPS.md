# DEMO STEPS

## Setup and starting point

- App router, prisma and local DB, tailwind CSS
- This is now only server components. Show each component.
- Lets enhance this message box with rsc and react 19! Goal: make it interactive while minimizing js on the client and reducing forntend complexity.

## Basic form with server action

(MessageInput + submitMessage)

- Attach action prop using React's extension of the form element
- Code submitMessage server action
- Submit to db, add hidden userId field. Mention .bind as an way to pass additional props. NB! Should be a part of the cookie or course and authentication but this is a demo, use auth or getcurrentuser.
- RevalidatePath purge cache

Notes: Lets start with the basic funcitonality. Make the form work and submit after reload with form action and hidden userId. When called with server action, behaves differently than native form, server action will have a post endpoint generated and be called without js. Then revalidatePath. “Just by doing that…”. Using native forms rather than buttons with onClicks, “had we used the onSubmit we would need React to have hydrated this page to be able to submit the form”.

## Add scroll handler

(MessageBox)

- Add donut pattern listener snippet and explain.
- Show the devtools that the server components arent there but the scroller is

Notes: Contains a children prop. Could be any prop. Can pass anything here, for example server components. Only the js for the scroll handler is loaded.

## Validate data

(submitMessage)

- Validate data with zod by moving object, throw error, use result in db insert
- Remove required on input
- Add error boundary and show it triggering
- Add back required on input

Notes: Don't trust the input from the client. Handle errors however, for example error boundary.

## Return validation

(submitMessage)

- Return instead of throw error and timestamp (create timestamp)
- Add max limit messages sent 5.
- Return success
- Get this to the user: useActionState, add initial state and add span "errorMessage"
- Show the error in the form.
- Pass _prevState and return Promise< State>

Notes: Could check for any requirements for your data. Create a component state when a form action is invoked. Can be called without js and return state without js. UseActionState returns a wrapped action, when called useActionState will return the last result of the action. Could use this to return the field errors.

## Toast message count

(MessageInput)

- useEffect to toast on error, depend on timestamp and error
- Change span tag to noscript

Notes: Noscript is a fallback.

## Return content for rollback on reset

(MessageInput)

- Explain form reset
- Return result.data.content in the payload.

Notes:
React 19 the automatically resets uncontrolled inputs automatically after the action finishes. Follows the mpa form submission behavior. Probably used to using a library that would control forms, like react-hook-form. Not needed. Maintain the entered value when there is error. Maybe this could be changed to be valid. Let's return the content and set it as the defaultValue so it's not lost.

## Slow server action

(submitMessage, MessageInput)

- Add slow() to server action
- Use third argument to show feedback
- Increase max messages to 8 and demo again

Notes: Realistic with a real db. Show feedback. We don't need to make an api endpoint and set error states etc like we used to in the next.js app router, which was a hassle.

## DEMO

- By the way, this works without js!
- Add some, we dont get automatic scrolling or button feedback or toasts, because all that requires js on the client.
- Demo without js until it fails.
- Turn js back on and show the feedback.

## Explanation

- What we've been doing is progressively enhancing this, meaning ensuring the basic functionality works at the lowest level of resources, no javascript, then adding things on top to enhance the user experience for users with those resources available.
- Lets say your user is on a slow device or slow connection and still waiting for js to finish downloading, parsing, or executing. This will work before its loaded, and will make the hydration for the JS that we do want load faster, because we reduced the amount of js on the client weaving the server component and the client together. Now depending on the user’s situation, they will get the better experience, and always have a form that works.

## Replace with submitButton

(SubmitButton + MessageBox)

- Extract button to submitbutton with useformstatus and spinner
- Say you can generalize this better, extend button element
- Add new button to the rsc-header and code the server action, inline server action: "use server", slow, delete, revalidate
- Talk about composability

## Optimistic update

- Stash current code
- Switch branch
- Show code for messagebox and messages
- Show messageInput and explain how it works, action fallback
- Send multiple messages slowly, then many until it fails

Notes: Can even enhance this further with optimistic updates. This still works without js. Adding an onSubmit for client-side js only functionality, use a state with defaultvalue maintain the progressive enhancement.

Of course, depending on your app you can decide how to implement forms and whether you still want your react-hook form and whatnot, but by using the the more primitive features of the web together with React 19 and React Server Components, we can make our forms very robust and while maintaining a great user experience.
