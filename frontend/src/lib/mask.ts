
export function maskPhone(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/^([0-9]{2})([0-9]{5})([0-9]{0,4}).*/, "($1) $2-$3")
    .replace(/[- ]+$/, "");
}

export function maskCPF(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function unmask(value: string): string {
  return value.replace(/\D/g, "");
}
