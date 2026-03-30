// export default async function fetchFunction({
//     crudMethod,apiUrl,postData,setError
// }){
//     try {
//         const response = await fetch(apiUrl,{
//             method : crudMethod,
//             headers : {
//                 "Content-Type" : "application/json"
//             },
//             ...((crudMethod === "POST" || crudMethod === "PUT") && {
//                 body : JSON.stringify(postData)
//             } )
//         });
//         const result = await response.json();
//         if(!response.ok) return setError(result);
//         return result;
//     } catch (error) {
//         setError(error.message);
//     }
// }