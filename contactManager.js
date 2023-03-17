import { LightningElement,api, wire, track } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import getContacts from '@salesforce/apex/ContactManagerHandler.getContacts';
import { CurrentPageReference } from 'lightning/navigation';
import SystemModstamp from '@salesforce/schema/Account.SystemModstamp';
import { refreshApex } from '@salesforce/apex';

export default class ContactManager extends LightningElement {
    @api recordId;
    @api contacts;
    tempContacts;
    contactid;
    selectedContact;
    /**
     * This method is to get the record id of the account 
     * Since this is a quick action we cannot get the recordid from the url
     */
   
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            this.recordId = currentPageReference.state.recordId;
            getContacts({accountId:this.recordId}).then(response=>{
                this.contacts = response;
                this.tempContacts = response;
            }).catch(error=>{
                error.log('there is an error'+error.body.message);
            });
        }
    }
    /**
     * This method is to filter the contacts based on the entered search text which is the last name of the contact
     */
    nameChangeHandler(event){
        if(event.detail.value){
            let newContacts = this.contacts.filter(function(contact){
                return (contact.lastName.toLowerCase().match(event.target.value.toLowerCase()));
            });
            console.log(newContacts);
            if(newContacts.length>0){
                this.contacts = [];
                this.contacts = [... newContacts];
            }
        }else{
            this.contacts = [... this.tempContacts];  
        }
    }
    /**
     * This method is the event handler for the child component this input is provided to the input page
     */
    onTileSelectHandler(event){
        const contactDetail = event.detail;
        this.selectedContact = contactDetail;
    }
    /**
     *This method is to update the list of contacts with the updated value
     * This method is also an event handler for the child component of edit page
     */
    onContactUpdateHandler(event){
        let index = null;
        index = this.contacts.findIndex(contact=>contact.contactId == event.detail.id);
        this.tempContacts[index].firstName =event.detail.fields.FirstName.value;
        this.tempContacts[index].lastName  = event.detail.fields.LastName.value;
        this.tempContacts[index].email  = event.detail.fields.Email.value;
        this.tempContacts[index].title  = event.detail.fields.Title.value;
        this.tempContacts[index].mobilePhone  = event.detail.fields.MobilePhone.value;
        this.contacts[index].firstName =event.detail.fields.FirstName.value;
        this.contacts[index].lastName  = event.detail.fields.LastName.value;
        this.contacts[index].email  = event.detail.fields.Email.value;
        this.contacts[index].title  = event.detail.fields.Title.value;
        this.contacts[index].mobilePhone  = event.detail.fields.MobilePhone.value;
    }
    /**
     * This is the constructor which is used to register listeners
     */
    constructor(){
        super();
        this.template.addEventListener('tileclick', this.onTileSelectHandler.bind(this));
        this.template.addEventListener('contactUpdated', this.onContactUpdateHandler.bind(this));
    }
    
}