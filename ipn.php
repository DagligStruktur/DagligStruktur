<?php
// 1. Bekreft IPN-data med PayPal
$req = 'cmd=_notify-validate';
foreach ($_POST as $key => $value) {
  $value = urlencode(stripslashes($value));
  $req .= "&$key=$value";
}

// Send bekreftelse til PayPal
$ch = curl_init('https://ipnpb.paypal.com/cgi-bin/webscr');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_CAINFO, __DIR__ . '/cacert.pem'); // for sikker tilkobling
$response = curl_exec($ch);
curl_close($ch);

// 2. Verifiser betaling
if (strcmp($response, "VERIFIED") == 0) {
    $paymentStatus = $_POST['payment_status'];
    $receiverEmail = $_POST['receiver_email'];
    $payerEmail = $_POST['payer_email'];
    $itemName = $_POST['item_name'];
    $mcGross = $_POST['mc_gross'];

    // 3. Sjekk at betalingen var "Completed"
    if ($paymentStatus === "Completed") {
        // 4. Sjekk at det er riktig e-post og pris
        if ($receiverEmail === "juliewold2006@gmail.com") {
            // 5. Tilpass produktene her:
            $vedlegg = "";
            $filnavn = "";
            $info = "";

            if ($itemName === "ukentlig kalender") {
                $vedlegg = __DIR__ . "/produkter/ukentlig_kalender.pdf";
                $filnavn = "ukentlig_kalender.pdf";
                $info = "Tusen takk for kjøpet! Her er din digitale kalender.";
            } elseif ($itemName === "forelesningsnotater") {
                $vedlegg = __DIR__ . "/produkter/forelesningsnotater.pdf";
                $filnavn = "forelesningsnotater.pdf";
                $info = "Takk for at du kjøpte forelesningsnotatene! Du finner dem vedlagt.";
            }

            // 6. Send e-post med produkt
            $to = $payerEmail;
            $subject = "Takk for kjøpet av $itemName";
            $message = $info;
            $boundary = md5(time());

            $headers = "From: Julie Wold juliewold2006@gmail.com\r\n";
            $headers .= "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

            $body = "--$boundary\r\n";
            $body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
            $body .= "$message\r\n";

            // Vedlegg
            $fileContent = chunk_split(base64_encode(file_get_contents($vedlegg)));
            $body .= "--$boundary\r\n";
            $body .= "Content-Type: application/octet-stream; name=\"$filnavn\"\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n";
            $body .= "Content-Disposition: attachment; filename=\"$filnavn\"\r\n\r\n";
            $body .= "$fileContent\r\n";
            $body .= "--$boundary--";

            mail($to, $subject, $body, $headers);
        }
    }
}
?>
