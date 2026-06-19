// ==========================================================================
// AUTOMATED GATEWAY SYSTEM (UPDATED CANVAS DRAWING METHOD TO EXCLUSIVELY MATCH TEAL ORIGINAL INTERFACES)
// ==========================================================================

const REGISTRATION_FORM = document.getElementById('paystackRegistrationForm');
const GUEST_NAME_DISPLAY = document.getElementById('displayGuestName');
const TICKET_ID_DISPLAY = document.getElementById('displayTicketId');
const STATUS_DISPLAY = document.getElementById('displayGatewayStatus');

const COLUMN_STEP_TWO = document.getElementById('col-step-two');
const COLUMN_STEP_THREE = document.getElementById('col-step-three');
const ADVICE_BANNER = document.getElementById('adviceBanner');
const BTN_DOWNLOAD = document.getElementById('btnDownload');
const BTN_WHATSAPP = document.getElementById('btnWhatsApp');

let currentGuestName = "";
let currentTicketId = "";
let currentPaymentRef = "";

const PAYSTACK_PUBLIC_KEY = 'pk_live_b5b3853d3d31f75dd9f8c8f919450a591ddc734e'; 

if (REGISTRATION_FORM) {
    REGISTRATION_FORM.addEventListener('submit', function (event) {
        event.preventDefault();

        const inputName = document.getElementById('attendeeFullName').value.trim();
        const inputEmail = document.getElementById('attendeeEmailAddress').value.trim();
        const inputPhone = document.getElementById('attendeeWhatsAppNumber').value.trim();

        if (typeof PaystackPop === 'undefined') {
            alert("Paystack transaction library failed to initialize correctly.");
            return;
        }

        const paystackInstance = new PaystackPop();
        
        paystackInstance.newTransaction({
            key: PAYSTACK_PUBLIC_KEY,
            email: inputEmail,
            amount: 2000 * 100, 
            currency: 'NGN',
            metadata: {
                custom_fields: [
                    { display_name: "Full Name", variable_name: "full_name", value: inputName },
                    { display_name: "WhatsApp Number", variable_name: "whatsapp_number", value: inputPhone }
                ]
            },
            onSuccess: function (transactionResponse) {
                const randomIdSeed = Math.floor(1000 + Math.random() * 9000);
                const computedPassCode = `PHS250-${randomIdSeed}`;

                currentGuestName = inputName;
                currentTicketId = computedPassCode;
                currentPaymentRef = transactionResponse.reference;

                GUEST_NAME_DISPLAY.innerText = inputName.toUpperCase();
                TICKET_ID_DISPLAY.innerText = computedPassCode;
                
                STATUS_DISPLAY.style.color = "#22c55e";
                STATUS_DISPLAY.innerText = "✓ CONFIRMED VIA PAYSTACK";

                COLUMN_STEP_TWO.classList.remove('blurred-locked-state');
                COLUMN_STEP_THREE.classList.remove('blurred-locked-state');
                
                ADVICE_BANNER.style.display = 'block';

                BTN_DOWNLOAD.removeAttribute('disabled');
                BTN_DOWNLOAD.classList.remove('disabled-action');
                BTN_WHATSAPP.removeAttribute('disabled');
                BTN_WHATSAPP.classList.remove('disabled-action');

                alert(`🎉 Payment Verified Successfully!\n\nYour Entry Pass (${computedPassCode}) has been generated.`);
            },
            onCancel: function () {
                console.log("Transaction sequence suspended by agent termination.");
            }
        });
    });
}

/**
 * Compiles custom PNG ticket capture strictly outputting onto the old original canvas colors layout
 */
function exportTicketGraphicFile() {
    if (!currentTicketId) return;

    const exportCanvas = document.getElementById('productionRenderingCanvas');
    if (!exportCanvas) return;
    
    const context = exportCanvas.getContext('2d');

    // Mapped Original Slate Background Configuration Color
    context.fillStyle = '#020c1b';
    context.fillRect(0, 0, 600, 750);

    // Mapped Cyan Header Block Strip Property Value
    context.fillStyle = '#64ffda';
    context.fillRect(0, 0, 600, 160);

    // Header Content Matrix Properties
    context.fillStyle = '#020c1b';
    context.textAlign = 'center';
    context.font = 'bold 36px sans-serif';
    context.fillText("PHS250 HANGOUT", 300, 75);

    context.font = 'bold 18px sans-serif';
    context.fillText("FAMILY HANGOUT 1.0 ENTRY PASS", 300, 115);

    // Core Form Fields Graphics Outputs Properties
    context.textAlign = 'left';
    
    context.fillStyle = '#8892b0';
    context.font = 'bold 15px sans-serif';
    context.fillText("GUEST ATTENDEE", 50, 240);
    
    context.fillStyle = '#ffffff';
    context.font = '900 32px sans-serif';
    context.fillText(currentGuestName.toUpperCase(), 50, 285);

    context.fillStyle = '#8892b0';
    context.font = 'bold 15px sans-serif';
    context.fillText("ASSIGNED TICKET VERIFICATION ID", 50, 400);
    
    context.fillStyle = '#64ffda';
    context.font = '900 40px sans-serif';
    context.fillText(currentTicketId, 50, 455);

    context.fillStyle = '#8892b0';
    context.font = 'bold 15px sans-serif';
    context.fillText("GATEWAY STATUS", 50, 560);
    
    context.fillStyle = '#22c55e';
    context.font = 'bold 22px sans-serif';
    context.fillText("✓ CONFIRMED VIA PAYSTACK", 50, 605);

    // Mapped Transparent Dotted Vector Lines Color
    context.strokeStyle = 'rgba(100, 255, 218, 0.2)';
    context.lineWidth = 3;
    context.setLineDash([12, 8]);
    context.beginPath();
    context.moveTo(40, 670);
    context.lineTo(560, 670);
    context.stroke();

    const dataStreamUrl = exportCanvas.toDataURL('image/png');
    const transferAnchor = document.createElement('a');
    transferAnchor.download = `PHS250-PASSPORT-${currentTicketId}.png`;
    transferAnchor.href = dataStreamUrl;
    document.body.appendChild(transferAnchor);
    transferAnchor.click();
    document.body.removeChild(transferAnchor);
}

function transmitWhatsAppVerification() {
    if (!currentTicketId) return;

    const destinationDeskLine = "2349068683427";
    const rawVerificationReceiptText = 
        `Hello Verification Desk! 🎟️\n\n` +
        `I have completed payment processing for the *PHS250 Picnic Hangout*.\n\n` +
        `• *Ticket Pass ID:* ${currentTicketId}\n` +
        `• *Guest Full Name:* ${currentGuestName}\n` +
        `• *Gateway Reference String:* ${currentPaymentRef}\n\n` +
        `I have successfully saved a backup copy of my pass. Please log my registration parameters onto the checkpoint database tracker index. See you there!`;

    const cleanEncodedString = encodeURIComponent(rawVerificationReceiptText);
    const compiledDirectRoute = `https://wa.me/${destinationDeskLine}?text=${cleanEncodedString}`;
    window.open(compiledDirectRoute, '_blank');
}

function resetInterfaceState() {
    if (REGISTRATION_FORM) {
        REGISTRATION_FORM.reset();
    }
    
    currentGuestName = "";
    currentTicketId = "";
    currentPaymentRef = "";

    GUEST_NAME_DISPLAY.innerText = "LOCKED UNTIL PAYMENT";
    TICKET_ID_DISPLAY.innerText = "PHS250-XXXX";
    STATUS_DISPLAY.style.color = "var(--text-slate-gray)";
    STATUS_DISPLAY.innerText = "PENDING VERIFICATION";

    COLUMN_STEP_TWO.classList.add('blurred-locked-state');
    COLUMN_STEP_THREE.classList.add('blurred-locked-state');
    ADVICE_BANNER.style.display = 'none';

    BTN_DOWNLOAD.setAttribute('disabled', 'true');
    BTN_DOWNLOAD.classList.add('disabled-action');
    BTN_WHATSAPP.setAttribute('disabled', 'true');
    BTN_WHATSAPP.classList.add('disabled-action');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}