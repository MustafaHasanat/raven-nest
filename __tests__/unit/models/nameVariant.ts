import NameVariant from "../../../lib/models/nameVariant.js";

it("should return the correct variants when entering: user", () => {
    const {
        camelCaseName,
        upperCaseName,
        pluralName,
        pluralUpperCaseName,
        pluralLowerCaseName,
    } = new NameVariant("user");

    expect(camelCaseName).toBe("user");
    expect(upperCaseName).toBe("User");
    expect(pluralName).toBe("users");
    expect(pluralLowerCaseName).toBe("users");
    expect(pluralUpperCaseName).toBe("Users");
});

it("should return the correct variants when entering: category", () => {
    const {
        camelCaseName,
        upperCaseName,
        pluralName,
        pluralUpperCaseName,
        pluralLowerCaseName,
    } = new NameVariant("category");

    expect(camelCaseName).toBe("category");
    expect(upperCaseName).toBe("Category");
    expect(pluralName).toBe("categories");
    expect(pluralLowerCaseName).toBe("categories");
    expect(pluralUpperCaseName).toBe("Categories");
});
