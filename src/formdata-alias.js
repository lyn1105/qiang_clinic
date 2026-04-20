/* src/formdata-alias.js */
const FormDataAlias = typeof window !== 'undefined' ? window.FormData : undefined;
export { FormDataAlias as FormData };
export default FormDataAlias;
