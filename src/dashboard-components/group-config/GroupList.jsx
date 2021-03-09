import {ListGroup} from 'react-bootstrap'


const GroupList = ({items, activeItemId, modifyState, onActiveItemChange=f=>f}) => {
    
    function changeActiveItem(newActiveId){
        modifyState((retainValue) => {return {
            command: retainValue,
            activeItemId: newActiveId
        }})
    }
    
 return <ListGroup variant="flush" className="ssp-light">
    {items.map((item, i) => 
               <ListGroup.Item key={i} active={(item.id === activeItemId)? 'active' : undefined}
                   onClick={()=> {changeActiveItem(item.id)
                                 onActiveItemChange(activeItemId, item.id)}}
                   action>
                    {item.name}
               </ListGroup.Item>)}
 </ListGroup>
}

export default GroupList;