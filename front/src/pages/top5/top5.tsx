import {useParams, Outlet} from 'react-router-dom';
import Layout from '../layout';
import { Container } from "reactstrap";
import NavbarTop5 from "../../components/top5/navbar";
import {useEffect} from "react";
import {GetBranchByName} from "../../services/Top5/branch";
import {useTop5} from "../../components/context/top5.context";

const Top5 = () => {
    const { id } = useParams();
    const Top5 = useTop5();

    useEffect(() => {
      console.log('reload menu', id)
        if( id ) {
            updateCurrentBranch( id )
        }
    }, [ id ])

    const updateCurrentBranch = async ( id: string ) => {
        const branch = await GetBranchByName( id );
        if( branch ) {
            Top5.setCurrentBranch( Object.assign( {}, branch ) );
        }
    }

    return (
        <Layout>
            <Container fluid>
                <NavbarTop5 branchName={id ? id : ''} branchId={Top5.currentBranch.id} categories={Top5.categories} />
                <Outlet />
            </Container>
        </Layout>
    )
}

export default Top5;