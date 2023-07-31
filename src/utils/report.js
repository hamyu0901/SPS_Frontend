import { deepClone } from "@/utils/utils";

const setAtomizerChartItems = (mainArray , subArray) => {

    let main = deepClone(mainArray)
    let sub = deepClone(subArray)

    for(let i=0; i < mainArray.length; i++){
        let found = false;
        for(let j = 0; j < subArray.length; j++){
            if(subArray[j][0] && ( mainArray[i][0].name === subArray[j][0].name )){
                found = true;
                break;
            }
        }
        !found && sub.splice(i, 0, []);
    }

    for(let j = 0; j < subArray.length; j++){
        let found = false;
        for(let i=0; i< mainArray.length; i++){
            if(mainArray[i][0] && (mainArray[i][0].name === subArray[j][0].name)){
                found = true;
                break;
            }
        }
        !found && main.splice(j, 0, []);
    }
    
    return { main : main, sub : sub }
}
const caculateAvg = (array, object) => {
    if(array.length > 0){
        let sum = 0;
        for(let i=0; i < array.length; i ++){
            sum += array[i].data
        }
        return (object.type_value === 1) ? Math.round((sum/array.length) * 100) / 100 : Math.round(sum/array.length)
    }else{
        return ''
    }
}
export { caculateAvg, setAtomizerChartItems };