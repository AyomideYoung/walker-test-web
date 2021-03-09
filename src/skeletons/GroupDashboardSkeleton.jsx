import Skeleton from 'react-loading-skeleton';
import {Container, Table, Button} from 'react-bootstrap';


const GroupDashboardSkeleton = () => 
<Container fluid>
        <div className="px-4 py-3">
            <h4><Skeleton width={90}/></h4>
            <div className="pl-4 ssp-black h5"><Skeleton width={145}/></div>
            <hr/>
             <Container className="justify-content-end my-3 d-flex flex-row" fluid>
                <Button variant="primary" size="sm">Add New Group</Button>
            </Container>
            <Table striped hover bordered>
                <thead>
                    <tr>
                        <th>Group name</th>
                        <th>Sub-groups</th>
                        <th>Registered Users</th>
                    </tr>
                </thead>
                <tbody className="ssp-regular">
                    {   
                       [1, 2, 3].map(i=> <tr key={i}>
                                      <td><Skeleton/></td>
                                      <td><Skeleton/></td>
                                      <td><Skeleton/></td>
                                  </tr>)
                    }
                </tbody>
            </Table>
        </div>
        
    </Container>

export default GroupDashboardSkeleton;