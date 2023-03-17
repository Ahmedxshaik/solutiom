import { LightningElement, wire, track, api } from 'lwc';
import getContacts from '@salesforce/apex/ContactEditFormController.getContacts';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
 
// columns
const columns = [
    {
        label: 'Name',
        fieldName: 'Name',
        type: 'text',
    }, {
        label: 'FirstName',
        fieldName: 'FirstName',
        type: 'text',
        editable: true,
    }, {
        label: 'LastName',
        fieldName: 'LastName',
        type: 'text',
        editable: true,
    }, {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone',
        editable: true
    },
    {
        label: 'Tile',
        fieldName: 'Title',
        type: 'text',
        editable: true
    }
];
 
export default class ContactEditForm extends LightningElement {
    columns = columns;
    @track contacts;
    saveDraftValues = [];
    @api recordId;
 
    @wire(getContacts,{accountId:'$recordId'})
    contactData(result) {
            this.contacts = result;
            this.intialContacts = result;
        if (result.error) {
            console.log('error');
            this.contacts = undefined;
            this.intialContacts = undefined;
        }
    };
    nameChangeHandler(event){
        const searchKey = event.target.value.toLowerCase();
        const tempContacts =(this.contacts.data);
        if ( searchKey ) {
            let result = this.contacts.data.filter(function(contact){
                return (contact.Name.toLowerCase().match(event.target.value.toLowerCase()));
            });
            if(result.length>0){
                this.contacts = [];
                this.contacts.data = [... result];
            }else{
                return this.refresh();
            }
        }else{
            this.contacts.data = [... this.intialContacts.data];
        }
    }
    handleSave(event) {
        console.log('contats'+JSON.stringify(this.contacts.data));
        console.log('save'+JSON.stringify(event.detail.draftValues));
        this.saveDraftValues = event.detail.draftValues;
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
 
        // Updateing the records using the UiRecordAPi
        
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.ShowToast('Success', 'Records Updated Successfully!', 'success', 'dismissable');
            this.saveDraftValues = [];
           
            return this.refresh();
        }).catch(error => {
            this.ShowToast('Error', 'An Error Occured!!', 'error', 'dismissable');
        }).finally(() => {
            this.saveDraftValues = [];
        });
        
    }
 
    ShowToast(title, message, variant, mode){
        const evt = new ShowToastEvent({
                title: title,
                message:message,
                variant: variant,
                mode: mode
            });
            this.dispatchEvent(evt);
    }
 
    // This function is used to refresh the table once data updated
    async refresh() {
        await refreshApex(this.intialContacts);
    }
}