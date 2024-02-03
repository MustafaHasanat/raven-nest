import {
    firstCharToLower,
    firstCharToUpper,
    pluralize,
} from "../utils/helpers/filesHelpers.js";

class NameVariant {
    constructor(name: string) {
        this.camelCaseName = name;
        this.upperCaseName = this.getUpperCaseName(name);
        this.upperSnakeCaseName = this.getUpperSnakeCaseName(name);
        this.pluralName = this.getPluralName(name);
        this.pluralUpperCaseName = this.getPluralUpperCaseName(this.pluralName);
        this.pluralLowerCaseName = this.getPluralLowerCaseName(this.pluralName);
        this.pluralUpperSnakeCaseName = this.getUpperSnakeCaseName(this.pluralName);
    }
    camelCaseName = "";
    upperCaseName = "";
    upperSnakeCaseName = "";
    pluralName = "";
    pluralLowerCaseName = "";
    pluralUpperCaseName = "";
    pluralUpperSnakeCaseName = "";

    private getUpperCaseName = (name: string) => firstCharToUpper(name);

    private getUpperSnakeCaseName = (name: string) =>
        name.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();

    private getPluralName = (name: string) => pluralize(name);

    private getPluralUpperCaseName = (pluralName: string) =>
        firstCharToUpper(pluralName);

    private getPluralLowerCaseName = (pluralName: string) =>
        firstCharToLower(pluralName);
}

export default NameVariant;
