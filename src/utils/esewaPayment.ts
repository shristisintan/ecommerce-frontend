export interface EsewaFormData {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export const submitEsewaPayment = (
  paymentUrl: string,
  formData: EsewaFormData
) => {
  const form =
    document.createElement(
      "form"
    );

  form.method = "POST";
  form.action = paymentUrl;

  Object.entries(
    formData
  ).forEach(
    ([key, value]) => {
      const input =
        document.createElement(
          "input"
        );

      input.type = "hidden";
      input.name = key;
      input.value = value;

      form.appendChild(
        input
      );
    }
  );

  document.body.appendChild(
    form
  );

  form.submit();

  document.body.removeChild(
    form
  );
};