export async function slow() {
  await new Promise(resolve => {
    return setTimeout(resolve, 1000);
  });
}
