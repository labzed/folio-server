//CANARY START
console.log('I AM THE CANARY');
console.log(module);
if (module.hot) {
  hot.accept();
}
//CANARY END
