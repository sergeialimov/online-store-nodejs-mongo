import { createHash } from "crypto";
import { Customer } from "../../libs/db";

function deterministicPseudorandomString(
  input: string,
  length: number = 8,
): string {
  const hash = createHash("sha256").update(input).digest("hex");
  const base62 = hash.substring(0, length).replace(/[0-9a-f]/g, (char) => {
    // Convert hexadecimal characters to base62
    const code = parseInt(char, 16);
    if (code < 10) return String.fromCharCode(code + 48); // 0-9
    if (code < 36) return String.fromCharCode(code + 55); // A-Z
    return String.fromCharCode(code + 61); // a-z
  });

  return base62.substring(0, length);
}

export function anonymiseCustomer(customer: Customer): Customer {
  return {
    ...customer,
    firstName: deterministicPseudorandomString(customer.firstName),
    lastName: deterministicPseudorandomString(customer.lastName),
    email:
      deterministicPseudorandomString(customer.email.split("@")[0]) +
      customer.email.substring(customer.email.indexOf("@")),
    address: {
      ...customer.address,
      line1: deterministicPseudorandomString(customer.address.line1),
      line2: customer.address.line2
        ? deterministicPseudorandomString(customer.address.line2)
        : "",
      postcode: deterministicPseudorandomString(customer.address.postcode),
    },
  };
}
