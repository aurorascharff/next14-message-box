# DEMO STEPS

## Introduction

- Thanks for the introduction
- Aurora, web dev, norway, consultant at Inmeta in oslo, not meta
- Excited to be here to be speaking here today to you about enhancing your forms with rsc
- Going to code a simplified version of something i’ve built for my customer project, where im actively using RSC, and it's working well for us.

## Setup and starting point

- App router, prisma and local DB, tailwind CSS
- This is now only server components. Show each component.
- "but what I'm doing here can be done with client apps with a little more work to create endpoints"
- Lets enhance this message box with react rsc and react 19! Goal: make it interactive while minimizing js on the client and reducing forntend complexity.

## Basic form with server action

(MessageInput + submitMessage)

- Attach action prop using React's extension of the form element
- "this could be an action on the client, but since we're using server components, we can pass a server action instead"
- Code submitMessage server action
- Submit to db, add hidden userId field
- RevalidatePath purge cache

Notes: Lets start with the basic funcitonality. Make the form work and submit after reload with form action and hidden userId. When called with server action, behaves differently than native form, server action will have a post endpoint generated and be called without js. Then revalidatePath. “Just by doing that…”. Using native forms rather than buttons with onClicks, “had we used the onSubmit we would need the JS to have hydrated this page to be able to submit the form”.

## Add scroll handler

(MessageBox)

- Add donut pattern listener snippet and explain.
- Show the devtools that the server components arent there but the scroller is

Notes: Contains a children prop. Can pass anything here, for example server components. Only the js for the scroll handler is loaded.

## Validate data

(submitMessage)

- Validate data with zod, throw error
- Remove required on input
- Add error boundary and show it triggering
- Add back required on input

Notes: Don't trust the input from the client.

## Return validation

(submitMessage)

- Return instead of throw error and timestamp (create timestamp)
- Add max limit messages sent 5.
- Return success
- Get this to the user: useActionState, add initial state and add span "errorMessage"
- Show the error in the form.
- Pass _prevState and return Promise< State>

Notes: Could check for any requirements for your data. Create a component state when a form action is invoked. Can be called without js and return state without js. UseActionState returns a wrapped action, when called useActionState will return the last result of the action.

## Toast message count

(MessageInput)

Input: useEffect handle errors, depend on timestamp. Modify to noscript handler fallback.

- useEffect to toast on error, depend on timestamp and error
- Change span tag to noscript

Notes: Noscript is a fallback.

## Return content for rollback on reset

(MessageInput)

- Return result.data.content in the payload.
- Explain form reset

Notes:
React 19 the automatically resets uncontrolled inputs automatically after the action finishes. Probably used to using a library that would control forms, like react-hook-form. Not needed. Maintain the entered value when there is error. Maybe this could be changed to be valid. Let's return the content and set it as the defaultValue so it's not lost. Native form stuff that prev hasn't been so relevant to React.

## Slow server action

(submitMessage, MessageInput)

- Add slow() to server action
- Use third argument to show feedback
- Increase max messages to 8 and demo again

Notes: Realistic with a real db. Show feedback. We don't need to make an api endpoint and set error states etc like we used to in the next.js app router, which was a hassle. Reference Sams talk "old way".

## DEMO

- By the way, this works without js!
- Add some, we dont get automatic scrolling or button feedback or toasts, because all that requires js on the client.
- Demo without js until it fails.
- Turn js back on and show the feedback.

## Explanation

- What we've been doing is progressively enhancing this, meaning ensuring the basic functionality works at the lowest level of resources, no javascript, then adding things on top to enhance the user experience for users with those resources available. By using action, useActionState, providing fallbacks, and native web.
- Lets say your user is on a slow device or slow connection and still waiting for js to finish downloading, parsing, or executing. This will work before its loaded, and will make the hydration for the JS that we do want load faster, because we reduced the amount of js on the client by utilizing server component and weaving server and client. Now depening on the user’s situation, they will get the better experience, and always have a form that works.
- Of course, depending on your app you can decide how to implement forms and whether you still want your react-hook form and whatnot, but by using the the more primitive features of the web together with React 19 and React Server Components, we can make our forms very robust and while maintaining a great user experience, which hasn't really been possible in plain React before.

## Optimistic update

- Stash current code
- Switch branch
- Show code for messagebox and messages
- Show messageInput and explain how it works, action fallback
- Send multiple messages slowly, then many until it fails

Notes: Can even enhance this further with optimistic updates. This still works without js. Adding an onSubmit for client-side js only functionality, use a state with defaultvalue maintain the progressive enhancement.

## Conclusion

That's it for this demo, the code is pinned on my GitHub and the optimistic update is on a branch, and follow me on Twitter if you are interested in more rsc content. Thanks for listening and thanks React Conf!
