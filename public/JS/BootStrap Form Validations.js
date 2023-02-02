// BOOTSTRAP JAVASCRIPT CODE TO DISABLE FORM SUBMISSIONS IF THERE ARE INVALID FIELDS
(function () {
    'use strict';

    // FETCH ALL THE FORMS WE WANT TO APPLY CUSTOM BOOTSTRAP VALIDATION STYLES TO
    const forms = document.querySelectorAll('.needs-validation');

    // LOOP OVER THEM AND PREVENT DEFAULT SUBMISSION BEHAVIOUR.
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (submitEvent) {
                submitEvent.preventDefault();
                let invalidPasswords = false;
                let newPassword = form.querySelector('#newPassword');
                let confirmPassword = form.querySelector('#confirmPassword');
                const editProfile = newPassword && confirmPassword;
                editProfile && (invalidPasswords = (form.id === "reset-password" && !newPassword.value && !confirmPassword) || (newPassword.value && !confirmPassword.value) || (!newPassword.value && confirmPassword.value) || (newPassword.value && confirmPassword.value && (newPassword.value !== confirmPassword.value)) ? true : false);
                if (!form.checkValidity() || (editProfile && invalidPasswords)) {
                    if (editProfile && invalidPasswords) {
                        newPassword.value = "";
                        confirmPassword.value = "";
                        newPassword.required = true;
                        confirmPassword.required = true;
                    } else if (editProfile && !invalidPasswords && form.id !== "reset-password" && newPassword.required && confirmPassword.required) {
                        newPassword.required = false;
                        confirmPassword.required = false;
                        form.classList.add('was-validated');
                        submitEvent.currentTarget.submit();
                    }
                    submitEvent.stopPropagation();
                    form.classList.add('was-validated');
                } else {
                    form.classList.add('was-validated');
                    submitEvent.currentTarget.submit();
                }
            }, false);
        });
})();