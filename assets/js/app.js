var cl=console.log;
const form=document.getElementById("form")
const Todo=document.getElementById("Todo")
const Description=document.getElementById("Description")
const IsCompleted=document.getElementById("IsCompleted")
const Add=document.getElementById("Add")
const Update=document.getElementById("Update")
const list=document.getElementById("list")
const spinner=document.getElementById("spinner")


const Base_Url="https://xhr-1st-crud-default-rtdb.firebaseio.com";
const Newtodo_url=`${Base_Url}/new1.json`


// localstate
state={
    todoArray:[],
    edit_id:null,
};

// spinner
function Handlespinner() {
    spinner.classList.toggle("d-none")
    
}

// snakbar
function Snakbar(msg,icon){
    return Swal.fire({
         text:msg,
        icon:icon,
        timer:1800

    });
   
}

function toggleDescription(ele) {
    const li = ele.closest("li");
    const description = li.querySelector(".collapse");

    if (description) {
        description.classList.toggle("show");
    }
}

//templating
function Templating(arr){
    let result=``;
    arr.forEach(ele => {
        result+=`<li class="list-group-item"id="${ele.id}">
                                    <div class="d-flex justify-content-between" onclick="toggleDescription(this)">
                                            <div>
                                            ${ele.IsCompleted? `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)" checked >`: `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)">`}

                                                <strong>${ele.todo}</strong>
                                            </div>
                                            <div>
                                                 <button onclick="event.stopPropagation(); onEdit(this)"class="btn btn-sm btn-primary"> Edit</button>
                                                <button onclick="event.stopPropagation(); onDelete(this)" class="btn btn-sm btn-danger">Delete</button>

                                            </div>
                                    </div>
                                    <div class="collapse">
                                        <div class="card-body">
                                        ${ele.Description}

                                        </div>
                                    </div>
                            </li> 

        `
        
    });
    list.innerHTML=result;
}

// create
async function onCreate(ele) {
    Handlespinner();
    ele.preventDefault();
    try{
        let obj={
            todo:Todo.value.trim(),
            Description:Description.value.trim(),
            IsCompleted:IsCompleted.value==="yes" ? true:false,
        }
        let res= await fetch(Newtodo_url,{
            method:"POST",
            body:JSON.stringify(obj),
            headers:{
                Authorization:"JWT TOKEN",
                "Content-Type":"application/json",


            },
            
        });
        let data= await res.json();
            obj.id=data.name;
            state.todoArray.unshift(obj);
            let li=document.createElement("li");
            li.id=obj.id
            li.className="list-group-item";
            li.innerHTML=
            `<div class="d-flex justify-content-between" onclick="toggleDescription(this)">
                                            <div>
                                                ${obj.IsCompleted? `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)" checked >`: `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)">`}
                                                <strong>${obj.todo}</strong>
                                            </div>
                                            <div>
                                                <button onclick="event.stopPropagation(); onEdit(this)"class="btn btn-sm btn-primary"> Edit</button>
                                                <button onclick="event.stopPropagation(); onDelete(this)" class="btn btn-sm btn-danger">Delete</button>

                                            </div>
                                    </div>
                                    <div class="collapse">
                                        <div class="card-body">
                                             ${obj.Description}

                                        </div>
                                    </div>`;
                                    list.prepend(li);
                                    Snakbar("Todo created!!", "success")
                                    form.reset();

                            }catch(err){
                                cl(err)

                            }finally{
                                Handlespinner();

    }
    
}


// read
async function ReadData(){
    Handlespinner();
    try{
        let res= await fetch(Newtodo_url,{
            method:"GET",
            body:null,
            headers:{
                Authorization:"JWT TOKEN",
                "Content-Type":"application/json",
            }
        });
        let data = await res.json();
        state.todoArray=[];
        for(const key in data){
            data[key].id=key
            state.todoArray.unshift(data[key]);
            }
              Templating(state.todoArray)
             }catch(err){
                cl(err)
            }finally{
                Handlespinner();

    }
}
ReadData();


// edit
function onEdit(eve){
    let Edit_id=eve.closest("li").id;
    state.edit_id=Edit_id
    let find_obj=state.todoArray.find(t=>t.id===Edit_id)
    Todo.value=find_obj.todo;
    Description.value=find_obj.Description;
    IsCompleted.value=find_obj.IsCompleted ? "yes" :"no";
    Add.classList.add("d-none");
    Update.classList.remove("d-none")
}


//update
async function UpdateDdata(eve){
    Handlespinner();
    try{
        let Update_id=state.edit_id;
        let ubobj={
            todo:Todo.value.trim(),
            Description:Description.value.trim(),
            IsCompleted:IsCompleted.value==="yes" ? true:false,
            id:Update_id
    }

    let Update_url=`${Base_Url}/new1/${Update_id}.json`
    let res= await fetch(Update_url,{
        method:"PATCH",
        body:JSON.stringify(ubobj),
        headers:{
            Authorization:"JWT TOKEN",
            "Content-Type":"application/json",


        }
    });
    let data= await res.json();
    let index= state.todoArray.findIndex(t=>t.id===Update_id)
    state.todoArray[index]=ubobj
    let li=document.getElementById(Update_id)
    li.innerHTML=`<div class="d-flex justify-content-between" onclick="toggleDescription(this)">
                                            <div>
                                                ${ubobj.IsCompleted? `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)" checked >`: `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)">`}
                                                <strong>${ubobj.todo}</strong>
                                            </div>
                                            <div>
                                                <button onclick="event.stopPropagation(); onEdit(this)"class="btn btn-sm btn-primary"> Edit</button>
                                                <button onclick="event.stopPropagation(); onDelete(this)" class="btn btn-sm btn-danger">Delete</button>

                                            </div>
                                    </div>
                                    <div class="collapse">
                                        <div class="card-body">
                                             ${ubobj.Description}

                                        </div>
                                    </div>`;
                                    Add.classList.remove("d-none");
                                    Update.classList.add("d-none")

                                    Snakbar("Todo created!!", "success")
                                    form.reset();
                                }catch(err){
                                    cl(err)

                                }finally{
                                    Handlespinner();}
}


// delete

async function onDelete(eve){
    Handlespinner();
    let swal= await Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
});
  if (swal.isConfirmed){

    try{
            let Remove_id=eve.closest("li").id
            let Remove_url=`${Base_Url}/new1/${Remove_id}.json`
            let res= await fetch(Remove_url,{
                method:"DELETE",
                body:null,
                headers:{
                     Authorization:"JWT TOKEN",
            "Content-Type":"application/json",

                }
            });
            let data = await res.json();
            let index= state.todoArray.findIndex(t=>t.id===Remove_id)
            state.todoArray.splice(index,1)
            eve.closest("li").remove();
            Snakbar("Data Removed","success")

        
    }catch(err){
        cl(err)

    }finally{
            Handlespinner();
    }

}
}
// additional fun

async function onCheck(ele) {
    let id = ele.closest("li").id;
    let todoObj = state.todoArray.find(item => item.id === id);
    if (!todoObj) return;
    todoObj.IsCompleted = ele.checked;
    try {
        let res = await fetch(`${Base_Url}/new1/${id}.json`, {
            method: "PATCH",
            body: JSON.stringify({
                IsCompleted: todoObj.IsCompleted
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error("Failed to update checkbox");
        }

        Snakbar("Todo status updated!", "success");
    } catch (err) {
        cl(err);
        ele.checked = !ele.checked;
        todoObj.IsCompleted = ele.checked;
        Snakbar("Status update failed!", "error");
    }
}
form.addEventListener("submit",onCreate)
Update.addEventListener("click",UpdateDdata)