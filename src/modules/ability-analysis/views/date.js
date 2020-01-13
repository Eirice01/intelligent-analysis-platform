export function dateSelectedFn(){
    let y = Number(new Date().getFullYear());
    let children=[],parent = [];
    for(let i=1;i<=12;i++){
        let obj={}
        obj.value=i;
        obj.label=i<10?`0${i}月`:`${i}月`;
        children.push(obj);
    }
    for(let j=0;j<=20;j++){
        let objParent={};
        objParent.value=y-j;
        objParent.label=`${y-j}年`;
        objParent.children = children;
        parent.push(objParent);
    }
    return parent
}