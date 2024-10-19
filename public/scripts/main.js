
token = localStorage.getItem('token');

if (token) {

    let role = JSON.parse(atob(token.split('.')[1])).user.role;
}
const stripe = Stripe('pk_test_C5CV4vIyiohnxaCblQSThXmT00uOyWvAUL');
const candidatesContainer = document.getElementById('candidates');
const cartItemsContainer = document.getElementById('cart-items');
const totalAmountElement = document.getElementById('total-amount');
const theCart = document.getElementById('theCart');
let tempCandidate = [];
let timeout;
let cart = [];


// let role = JSON.parse(atob(token.split('.')[1])).user.role;


function checkValue(candidateId) {
    let amount = document.getElementById('amount-' + candidateId + '').value;
    amount = amount * 1;
    if (amount > 3300) {
        document.getElementById("alter" + candidateId + "").disabled = true;
        document.getElementById("alter" + candidateId + "").classList.remove("btn-success");
        document.getElementById("myBorder" + candidateId + "").classList.remove('border-success');
        sendErrorMessage('Maximum allowable donation is $3300');
        myCloseMessageFunction();

        return false;
    }
    if (amount > 0) {
        document.getElementById("alter" + candidateId + "").disabled = false;
        document.getElementById("alter" + candidateId + "").classList.add("btn-success");
        document.getElementById("myBorder" + candidateId + "").classList.add('border-success');

    }
    else {

        document.getElementById("alter" + candidateId + "").classList.remove("btn-success");
        document.getElementById("myBorder" + candidateId + "").classList.remove("border-success");
        document.getElementById("alter" + candidateId + "").disabled = true;

    }
}

function addToCart(candidateId, candidateName) {
    let amountInput = document.getElementById(`amount-${candidateId}`);
    const amount = document.getElementById(`amount-${candidateId}`).value;
    if (amount > 0) {
        const existingItem = cart.find(item => item.candidateId === candidateId);
        if (existingItem) {
            existingItem.amount += parseFloat(amount);
        } else {
            cart.push({ candidateId, candidateName, amount: parseFloat(amount) });
        }
        amountInput.value = '';
        document.getElementById("alter" + candidateId + "").classList.remove("btn-success");
        document.getElementById("myBorder" + candidateId + "").classList.remove("border-success");
        updateCart();
    }

}

function deleteFromCart(candidateId) {

    let newArray = cart.filter(item => item.candidateId !== candidateId);
    cart = newArray;

    let cartItem = document.getElementById(`cart-item${candidateId}`);
    cartItem.remove();

    let cartTotal = 0;
    for (let i = 0; i < newArray.length; i++) {
        cartTotal += newArray[i].amount;
    }
    totalAmountElement.textContent = cartTotal.toFixed(2);
}

function cancelCartItemUpdate(candidateId) {
    let startingAmount = cart.find(item => item.candidateId === candidateId).amount;
    let cartItemUpdateButton = document.getElementById(`cart-item-update-button${candidateId}`);
    let cartItemDeleteButton = document.getElementById(`cart-item-delete-button${candidateId}`);
    let cartItemDoneButton = document.getElementById(`cart-item-done-button${candidateId}`);
    let cartItemCancelButton = document.getElementById(`cart-item-cancel-button${candidateId}`);
    let originalAmount = document.getElementById(`original-amount${candidateId}`);
    let editedAmount = document.getElementById(`edited-amount${candidateId}`);
    let dollarSign = document.getElementById(`dollar-sign${candidateId}`);

    cartItemDoneButton.classList.add('bye-for-now');
    cartItemCancelButton.classList.add('bye-for-now');
    cartItemUpdateButton.classList.remove('bye-for-now');
    cartItemDeleteButton.classList.remove('bye-for-now');
    editedAmount.classList.add('bye-for-now');
    dollarSign.classList.add('bye-for-now');
    originalAmount.classList.remove('bye-for-now')
    editedAmount.value = '';
    originalAmount.innerText = "$" + startingAmount;

    let cartTotal = 0;
    for (let i = 0; i < cart.length; i++) {
        cartTotal += cart[i].amount;
    }
    totalAmountElement.textContent = cartTotal.toFixed(2);



}

function updateCartItem(candidateId) {
    let cartItemUpdateButton = document.getElementById(`cart-item-update-button${candidateId}`);
    let cartItemDeleteButton = document.getElementById(`cart-item-delete-button${candidateId}`);
    let cartItemDoneButton = document.getElementById(`cart-item-done-button${candidateId}`);
    let cartItemCancelButton = document.getElementById(`cart-item-cancel-button${candidateId}`);
    let originalAmount = document.getElementById(`original-amount${candidateId}`);
    let editedAmount = document.getElementById(`edited-amount${candidateId}`);
    let dollarSign = document.getElementById(`dollar-sign${candidateId}`);

    cartItemUpdateButton.classList.add('bye-for-now');
    cartItemDeleteButton.classList.add('bye-for-now');
    cartItemDoneButton.classList.remove('bye-for-now');
    cartItemCancelButton.classList.remove('bye-for-now');
    originalAmount.classList.add('bye-for-now');
    editedAmount.classList.remove('bye-for-now');
    dollarSign.classList.remove('bye-for-now');

}

function doneAtCart(candidateId) {
    let startingAmount = cart.find(item => item.candidateId === candidateId).amount;
    let cartItemUpdateButton = document.getElementById(`cart-item-update-button${candidateId}`);
    let cartItemDeleteButton = document.getElementById(`cart-item-delete-button${candidateId}`);
    let cartItemDoneButton = document.getElementById(`cart-item-done-button${candidateId}`);
    let cartItemCancelButton = document.getElementById(`cart-item-cancel-button${candidateId}`);
    let originalAmount = document.getElementById(`original-amount${candidateId}`);
    let editedAmount = document.getElementById(`edited-amount${candidateId}`);
    let dollarSign = document.getElementById(`dollar-sign${candidateId}`);


    cartItemUpdateButton.classList.remove('bye-for-now');
    cartItemDeleteButton.classList.remove('bye-for-now');
    cartItemDoneButton.classList.add('bye-for-now');
    cartItemCancelButton.classList.add('bye-for-now');
    originalAmount.classList.remove('bye-for-now');
    editedAmount.classList.add('bye-for-now');
    dollarSign.classList.add('bye-for-now');

    let newAmount = document.getElementById(`edited-amount${candidateId}`).value;

    if (newAmount > 0) {
        let newItem = cart.find(item => item.candidateId === candidateId);
        newItem.amount = parseFloat(newAmount);

        originalAmount.innerText = "$" + newItem.amount;
        editedAmount.value = '';
        editedAmount.setAttribute('placeholder', newAmount);

        let cartTotal = 0;
        for (let i = 0; i < cart.length; i++) {
            cartTotal += cart[i].amount;
        }

        totalAmountElement.textContent = cartTotal.toFixed(2);

    } else {
        sendErrorMessage('Entered amount was the same; no change will be made.');
        myCloseMessageFunction();
    }
}

function updateCart() {
    cartItemsContainer.innerHTML = '';
    let totalAmount = 0;
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('row', 'item-width');
        cartItem.innerHTML =
            `<div class="col-4 car-cand-div"><p class="mt-2 cart-candidate">${item.candidateName}: </p></div>
        <div class="col-3 row"><p id="original-amount${item.candidateId}" class="mt-2"> $${item.amount}</p>
        <p id="dollar-sign${item.candidateId}" class="mt-2 bye-for-now">$</p><input type="number" id="edited-amount${item.candidateId}" class="mb-2 cart-item-edited-amount bye-for-now" placeholder="${item.amount}"></div>
        <div class="modify-buttons mt-1 car-cand-div col-5"><button id="cart-item-update-button${item.candidateId}" onclick="updateCartItem('${item.candidateId}')" class="cart-item-updater-button updater">update</button>
        <button id="cart-item-delete-button${item.candidateId}" onclick="deleteFromCart('${item.candidateId}')" class="cart-item-delete-button deleter">delete</button>
        <button id="cart-item-done-button${item.candidateId}" onclick="doneAtCart('${item.candidateId}')" class="bye-for-now ml-1 text-success cart-item-delete-button done">done</button>
        <button id="cart-item-cancel-button${item.candidateId}" onclick="cancelCartItemUpdate('${item.candidateId}')" class="bye-for-now text-danger cart-item-delete-button cancel">cancel</button>
        </div> 
          `;
        cartItem.setAttribute('id', `cart-item${item.candidateId}`);
        cartItemsContainer.appendChild(cartItem);
        totalAmount += item.amount;
    });
    totalAmountElement.textContent = totalAmount.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        document.getElementById("checkout-button").style.border = "none";
        document.getElementById("checkout-button").style.outline = "none";

        sendConfirmMessage("Please add donations to the cart before proceeding to checkout");
        myCloseMessageFunction();
    }
    fetch('/api/donations/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ donations: cart })
    })
        .then(response => response.json())
        .then(session => {
            return stripe.redirectToCheckout({ sessionId: session.id });
        })
        .then(result => {
            if (result.error) {
                alert(result.error.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// function dragOverHandler(ev) {

//     // Prevent default behavior (Prevent file from being opened)
//     ev.preventDefault();
// }


// function dropHandler(ev) {
//     console.log("File(s) dropped");

//     // Prevent default behavior (Prevent file from being opened)
//     ev.preventDefault();

//     if (ev.dataTransfer.items) {
//         // Use DataTransferItemList interface to access the file(s)
//         [...ev.dataTransfer.items].forEach((item, i) => {
//             // If dropped items aren't files, reject them
//             if (item.kind === "file") {
//                 const file = item.getAsFile();
//                 console.log(`… file[0].name = ${file.name}`);
//                 console.log("file:*****in section 1*********", file.name);
//                 const picture = file ? `${file.name}` : null;
//             }
//         });

//     } else {

//         // Use DataTransfer interface to access the file(s)
//         [...ev.dataTransfer.files].forEach((file, i) => {

//             if (file.kind === "file") {
//                 const file = item.getAsFile();
//                 console.log(`… file[0].name = ${file.name}`);
//                 console.log("file:*****in section 2*********", file.name);
//                 const picture = file ? `${file.name}` : null;
//             }
//         });
//     }
// }

async function updateCandidate(candidateId) {
    let role = JSON.parse(atob(token.split('.')[1])).user.role;

    if (!token || role !== 'admin') {
        return alert('You are not authorized to perform this action');
    }
    let initialName = document.getElementById(`cand-name${candidateId}`).innerText;
    let initialDescription = document.getElementById(`cand-description${candidateId}`).innerText;
    let initialPicture = document.getElementById(`change-image${candidateId}`).src;

    tempCandidate.push({ candidateId, initialName, initialDescription, initialPicture });

    const candidateName = document.getElementById(`cand-name${candidateId}`);
    const candidateDescription = document.getElementById(`cand-description${candidateId}`);
    const candidateNameReplace = document.getElementById(`cand-name-replace${candidateId}`);
    const candidateDescriptionReplace = document.getElementById(`cand-description-replace${candidateId}`);
    const candidateImageReplace = document.getElementById(`cand-image-replace${candidateId}`);
    const alterButton = document.getElementById(`alter${candidateId}`);
    const alterCandidate = document.getElementById(`alter-candidate${candidateId}`);
    const candEditButtonUpdate = document.getElementById(`cand-edit-button-update${candidateId}`);
    const candEditButtonDelete = document.getElementById(`cand-edit-button-delete${candidateId}`);
    const candEditButtonCancel = document.getElementById(`cand-edit-button-cancel${candidateId}`);
    const UpdatePicInput = document.getElementById(`picture${candidateId}`);

    candidateName.classList.add('bye-for-now');
    candidateDescription.classList.add('bye-for-now');
    candidateNameReplace.classList.remove('bye-for-now');
    candidateDescriptionReplace.classList.remove('bye-for-now');
    candidateImageReplace.classList.remove('bye-for-now');
    UpdatePicInput.classList.remove('bye-for-now');
    alterButton.classList.add('bye-for-now');
    alterCandidate.classList.remove('bye-for-now');
    candEditButtonUpdate.classList.add('bye-for-now');
    candEditButtonDelete.classList.add('bye-for-now');
    candEditButtonCancel.classList.remove('bye-for-now');

    const candidateChangeImage = document.getElementById(`change-image${candidateId}`);
    candidateChangeImage.src = "/uploads/uploadpic.png";


};

function handleFormSubmit(event, candidateId) {
    event.preventDefault();
    finalizeCandidateUpdate(candidateId); // Call the function to handle the form submission
}

async function finalizeCandidateUpdate(candidateId) {

    const candidateName = document.getElementById(`cand-name${candidateId}`);
    const candidateDescription = document.getElementById(`cand-description${candidateId}`);
    const candidateNameReplace = document.getElementById(`cand-name-replace${candidateId}`)
    const candidateDescriptionReplace = document.getElementById(`cand-description-replace${candidateId}`);
    const candidateChangeImage = document.getElementById(`change-image${candidateId}`);
    const candEditButtonUpdate = document.getElementById(`cand-edit-button-update${candidateId}`);
    const candEditButtonDelete = document.getElementById(`cand-edit-button-delete${candidateId}`);
    const candEditButtonCancel = document.getElementById(`cand-edit-button-cancel${candidateId}`);
    const UpdatePicInput = document.getElementById(`picture${candidateId}`);
    const alterButton = document.getElementById(`alter${candidateId}`);
    const alterCandidate = document.getElementById(`alter-candidate${candidateId}`);
    const currentName = document.getElementById(`current-name${candidateId}`).value;
    const currentDescription = document.getElementById(`current-description${candidateId}`).value;
    const currentPicture = document.getElementById(`current-picture${candidateId}`).value;

    // const token = localStorage.getItem('token');

    const name = document.getElementById(`cand-name-replace${candidateId}`).value;
    const description = document.getElementById(`cand-description-replace${candidateId}`).value;
    const pictureInput = document.getElementById(`picture${candidateId}`);
    const picture = pictureInput.files[0]; // Get the selected file

    const candidate = new FormData();
    candidate.append('name', name);
    candidate.append('description', description);
    if (picture) {
        candidate.append('picture', picture);
    }

    const response = await fetch(`api/candidates/update/` + candidateId, {
        method: 'POST',
        headers: {
            'x-auth-token': token
            // 'Content-Type' header should not be set when sending FormData
        },
        body: candidate // FormData is correctly passed as the body
    });

    if (response.ok) {

        sendConfirmMessage("Candidate updated successfully!");
        myCloseMessageFunction();

        candidateName.classList.remove('bye-for-now');
        candidateDescription.classList.remove('bye-for-now');
        candidateName.innerText = name ? name : currentName;
        candidateDescription.innerText = description ? description : currentDescription;
        if (!picture) {
            candidateChangeImage.src = currentPicture;
        }

        candidateNameReplace.value = '';
        candidateDescriptionReplace.value = '';
        candidateNameReplace.setAttribute('placeholder', name ? name : currentName);
        candidateDescriptionReplace.setAttribute('placeholder', description ? description : currentDescription);
        candidateNameReplace.classList.add('bye-for-now');
        candidateDescriptionReplace.classList.add('bye-for-now');
        candEditButtonUpdate.classList.remove('bye-for-now');
        candEditButtonDelete.classList.remove('bye-for-now');
        candEditButtonCancel.classList.add('bye-for-now');
        UpdatePicInput.classList.add('bye-for-now');
        alterButton.classList.remove('bye-for-now');
        alterCandidate.classList.add('bye-for-now');

        let item = tempCandidate.find(item => item.initialId === candidateId);
        tempCandidate.splice(item, 1);

    } else {
        const error = await response.json();
        messageDiv.innerHTML = `<div class="alert alert-danger">${error.msg}</div>`;
    }
}

function picFunction(candidateId) {
    const pictureInput = document.getElementById(`picture${candidateId}`);
    const picture = pictureInput.files[0];
    if (picture) {
        const reader = new FileReader();
        reader.onload = function (event) {
            document.getElementById(`change-image${candidateId}`).src = event.target.result;
        }
        reader.readAsDataURL(picture);
    }
}

async function deleteCandidate(candidateId) {
    const token = localStorage.getItem('token');
    if (token) {
        let role = JSON.parse(atob(token.split('.')[1])).user.role;

        if (!token || role !== 'admin') {
            return alert('You are not authorized to perform this action');
        }
    }

    const response = await fetch(`api/candidates/delete/` + candidateId, {
        method: 'POST',
        headers: {
            'x-auth-token': token
        }
    });

    const messageDiv = document.getElementById('message');
    if (response.ok) {
        document.getElementById(`myBorder${candidateId}`).style.display = 'none';
        sendConfirmMessage("Candidate deleted successfully!");
        myCloseMessageFunction();
    } else {
        const error = await response.json();
        messageDiv.innerHTML = `<div class="alert alert-danger">${error.msg}</div>`;
    }
};

function cancelCandidateUpdate(candidateId) {

    let candidateName = document.getElementById(`cand-name${candidateId}`);
    let candidateDescription = document.getElementById(`cand-description${candidateId}`);
    let candidateChangeImage = document.getElementById(`change-image${candidateId}`);
    let candidateNameReplace = document.getElementById(`cand-name-replace${candidateId}`);
    let candidateDescriptionReplace = document.getElementById(`cand-description-replace${candidateId}`);
    const candEditButtonUpdate = document.getElementById(`cand-edit-button-update${candidateId}`);
    const candEditButtonDelete = document.getElementById(`cand-edit-button-delete${candidateId}`);
    const candEditButtonCancel = document.getElementById(`cand-edit-button-cancel${candidateId}`);
    const UpdatePicInput = document.getElementById(`picture${candidateId}`);
    const alterButton = document.getElementById(`alter${candidateId}`);
    const alterCandidate = document.getElementById(`alter-candidate${candidateId}`);


    const currentName = document.getElementById(`current-name${candidateId}`).value;
    const currentDescription = document.getElementById(`current-description${candidateId}`).value;
    const currentPicture = document.getElementById(`current-picture${candidateId}`).value;

    candidateName.classList.remove('bye-for-now');
    candidateDescription.classList.remove('bye-for-now');
    candidateNameReplace.value = '';
    candidateDescriptionReplace.value = '';
    candidateNameReplace.classList.add('bye-for-now');
    candidateDescriptionReplace.classList.add('bye-for-now');
    candidateChangeImage.src = currentPicture;
    candEditButtonUpdate.classList.remove('bye-for-now');
    candEditButtonDelete.classList.remove('bye-for-now');
    candEditButtonCancel.classList.add('bye-for-now');
    UpdatePicInput.classList.add('bye-for-now');
    alterButton.classList.remove('bye-for-now');
    alterCandidate.classList.add('bye-for-now');

    candidateName = currentName;
    candidateDescription = currentDescription;
    candidateChangeImage.src = tempCandidate[0].initialPicture;

    let item = tempCandidate.find(item => item.initialId === candidateId);
    tempCandidate.splice(item, 1);
}

function openCart() {
    theCart.setAttribute('style', 'position: sticky; top: 0; z-index: 1000; background: rgba(255,255,255, 0.9);');
    theCart.classList.toggle('bye-for-now')
}

function logout() {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Redirect to the login page
    window.location.href = '/index';
}

function myCloseMessageFunction() {
    let timeout
    timeout = setTimeout(closeMessage, 3000);
}

function closeMessage() {
    const messageDiv = document.getElementById(`message`);
    messageDiv.innerHTML = '';

}

function sendErrorMessage(message) {
    const messageDiv = document.getElementById(`message`);
    messageDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
}

function sendConfirmMessage(message) {
    const messageDiv = document.getElementById(`message`);
    messageDiv.innerHTML = `<div class="alert alert-success">${message}</div>`;
}

function avoidLoginAttempt() {
    const theEmail = document.getElementById('email').value;
    const thePassword = document.getElementById('password').value;

    if (theEmail === '' || !theEmail.includes('@') || !theEmail.includes('.com') || thePassword.length < 5) {
        document.getElementById("loginB").disabled = true;
        sendErrorMessage('Your login form is not complete yet');
        myCloseMessageFunction();
    } else {
        document.getElementById("loginB").disabled = false;
    }
}

function avoidRegisterAttempt() {
    const theUserName = document.getElementById('username').value;
    const theEmail = document.getElementById('email').value;
    const thePassword = document.getElementById('password').value;

    if (theUserName.length < 2 || theEmail === '' || !theEmail.includes('@') || !theEmail.includes('.com') || thePassword.length < 5) {
        document.getElementById("registerB").disabled = true;
        sendErrorMessage('Your registration form is not complete yet');
        myCloseMessageFunction();
    } else {
        document.getElementById("registerB").disabled = false;
    }
}

function avoidNewCandidateAttempt() {
    const theName = document.getElementById("name").value;
    const theDescription = document.getElementById("description").value;
    const thePicture = document.getElementById("picture").value;


    if (theName.length < 2 || theDescription.length < 2 || !thePicture) {
        document.getElementById("addCandidateButton").disabled = true;
        sendErrorMessage('The Add Candidate form is not complete yet');
        myCloseMessageFunction();

    } else {
        document.getElementById("addCandidateButton").disabled = false;
    }
}

function checkName() {
    const theName = document.getElementById("name").value;

    if (theName.length < 2 || theName.length > 20) {
        sendErrorMessage('Please enter a name of at least 2 characters and not more than 20 characters');
        myCloseMessageFunction();
    }
}

function checkDescription() {
    const theDescription = document.getElementById("description").value;

    if (theDescription.length < 2 || theDescription.length > 20) {
        sendErrorMessage('Please enter a description of at least 2 characters and not more than 20 characters');
        myCloseMessageFunction();
    }
}

function checkPicture() {
    const thePicture = document.getElementById("picture").value;
    const filePath = thePicture.value;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    if (!filePath) {
        sendErrorMessage('Please upload a picture');
        myCloseMessageFunction();
        return;
    }

    if (!allowedExtensions.exec(filePath)) {
        sendErrorMessage('Please upload a picture of type .gif, .png, .jpg, or .jpeg');
        myCloseMessageFunction();
        fileInput.value = ''; // Clear the input
        return;
    }
}

function emailCheck() {
    const theEmail = document.getElementById('email').value;

    if (theEmail === '' || !theEmail.includes('@') || !theEmail.includes('.com')) {
        sendErrorMessage('Please enter a valid email address');
        myCloseMessageFunction();
    }
}

function userNameCheck() {
    const theUserName = document.getElementById('username').value;

    if (theUserName === '' || theUserName.length < 2) {
        sendErrorMessage('Please enter a valid username - 2 chracters minimum');
        myCloseMessageFunction();
    }
}

function passwordCheck() {
    const thePassword = document.getElementById('password').value;

    if (thePassword === '' || thePassword.length < 5) {
        sendErrorMessage('Please enter a valid password - 5 chracters minimum');
        myCloseMessageFunction();
    }
}

function checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
        let role = JSON.parse(atob(token.split('.')[1])).user.role;


        if (token && role && role === 'admin') {
            let timeout;
            sendErrorMessage('Please login as general user to donate; Admin not permitted.');
            myCloseMessageFunction();
            timeout = setTimeout(sendUserToLogin, 3000);
        }

    }
    if (!token) {
        let timeout
        sendErrorMessage('Please login to donate; donations are regulated.');
        myCloseMessageFunction();
        timeout = setTimeout(sendUserToLogin, 3000);
    }
}

function sendUserToLogin() {
    window.location.href = '/login';
}

function sendToIndex() {
    window.location.href = '/index';
}

function closeAfterMessage() {
    timeout = setTimeout(sendUserToLogin, 3000);
}





