
module.exports = function Pipeline(...middlewares) {
    
    const stack = middlewares
  
    const push = (...middlewares) => {
      stack.splice(stack.length-1, 0, ...middlewares);
    }
    

  
    let execute = async(context) => {
      let looper = Object.keys(stack)
      let return_value

      for (let index = 0; index < looper.length; index++) {
        return_value = await stack[looper[index]](context)
        if(return_value) {  break};
      }
      return return_value
/*
      for (const middleware of stack) {
        let return_value = await middleware(context)
        
      }*/
    }
  
    return { push, execute }
}