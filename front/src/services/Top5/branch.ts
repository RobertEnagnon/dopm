import {Branch} from "../../models/Top5/branch";
import RequestService from "../request";

/*const GetBranches = async () => {
    let req = new RequestService();
    const res = await req.fetchEndpoint( 'branches' )
    return res?.data || [];
}*/
const GetBranches = async () => {
    let branches: Array<Branch> = []

    let req = new RequestService();
    await req.fetchEndpoint( 'branches' )
    .then( res => {
        if(res?.data && res.data.length > 0) {
            res.data.forEach((branch: Branch) => {
                branches.push({
                    id: branch.id,
                    name: branch.name,
                    orderBranch: branch.orderBranch,
                    createdAt: branch.createdAt,
                    updatedAt: branch.updatedAt,
                })
            })
        }
    })

    return branches
}

const GetOneBranch = async (id: number) => {
    let branch: Branch | undefined;
    let req = new RequestService();
    const res = await req.fetchEndpoint(`branch/${id}`)
    branch = res?.data;
    return branch;
}

const GetBranchByName = async ( name: string ) => {
    let branch: Branch | undefined;
    let req = new RequestService();
    const res = await req.fetchEndpoint( `branchbyname/${name}` );
    if( res && res.data ) {
        branch = res.data;
    }

    return branch;
}
const CreateBranch = async (data: Branch) => {
    const branchToCreate = {
        name: data.name
    }
    let req = new RequestService();
    const res = req.fetchEndpoint(`branches`, 'POST', branchToCreate)
    return res;
}
const DeleteBranch = async (branchId: number) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`branches/${branchId}`, "DELETE");
}
const UpdateBranch = async (data: Branch, newName: string) => {
    const branchToUpdate = {
        name: newName,
        orderBranch: data.orderBranch
    }
    let req = new RequestService();
    return await req.fetchEndpoint(`branches/${data.id}`, "PUT", branchToUpdate);
}

export {
    GetBranches,
    GetOneBranch,
    GetBranchByName,
    CreateBranch,
    DeleteBranch,
    UpdateBranch
}