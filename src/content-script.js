
import GreetTask from "./greet";
import { companyList } from "./data/companyList"
console.log(companyList)
// $(function () {
setTimeout(() => {
    const greetTask = new GreetTask();
    greetTask.listerMessage().init();
}, 3000);
// })

