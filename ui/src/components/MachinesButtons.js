
import React from 'react';
import { GridCell } from '@progress/kendo-react-grid';
import '../css/MachinesMain.css';


export default function MachinesButtons(openEditForm, deletemachine, details) {
    
    return class extends GridCell {
        render() {
            return (
                <td>
                    <button
                        className="k-primary k-button k-grid-edit-command"
                        onClick={() => {
                            openEditForm(this.props.dataItem.id)
                             console.log("openEditForm(this.props.dataItem.id): ", this.props.dataItem.id)}
                                       }>Edit</button>

                                        &nbsp;

                      <button
                                            className="k-primary k-button k-grid-edit-command"
                                            onClick={()=> deletemachine(this.props.dataItem.id)}>remove</button>


&nbsp;

                    <button
                        className="k-primary k-button k-grid-details-command"
                        onClick={() => { details(this.props.dataItem);
                                       }}>Details</button>

                                        &nbsp;
                </td>
            );
        }
    };
}
