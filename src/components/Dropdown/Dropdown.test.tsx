import {fireEvent, render, screen} from "@testing-library/react";
import Dropdown from "./Dropdown";

describe("Dropdown component", () => {
    const dropdownName = "Test Dropdown";
    const items = ["Item 1", "Item 2", "Item 3"];
    const onSelectedItemMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders dropdown name", () => {
        render(
            <Dropdown dropdownName={dropdownName} items={items} onSelectedItem={onSelectedItemMock} />
        );

        const dropdownNameElement = screen.getByText(dropdownName);
        expect(dropdownNameElement).toBeInTheDocument();
    });

    test("clicking dropdown button toggles dropdown content visibility", () => {
        render(
            <Dropdown dropdownName={dropdownName} items={items} onSelectedItem={onSelectedItemMock} />
        );

        const dropdownButtonElement = screen.getByText(dropdownName);
        fireEvent.click(dropdownButtonElement);

        const dropdownContentElement = screen.getByRole("list");
        expect(dropdownContentElement).toBeInTheDocument();
        expect(dropdownContentElement).toHaveClass("dropdown-content");

        fireEvent.click(dropdownButtonElement);

        expect(dropdownContentElement).not.toBeInTheDocument();
    });

    test("clicking item calls onSelectedItem and closes dropdown content", () => {
        render(
            <Dropdown dropdownName={dropdownName} items={items} onSelectedItem={onSelectedItemMock} />
        );

        const dropdownButtonElement = screen.getByText(dropdownName);
        fireEvent.click(dropdownButtonElement);

        const dropdownContentElement = screen.getByRole("list");
        const itemElement = screen.getByText(items[0]);
        fireEvent.click(itemElement);

        expect(onSelectedItemMock).toHaveBeenCalledTimes(1);
        expect(onSelectedItemMock).toHaveBeenCalledWith(items[0]);
        expect(dropdownContentElement).not.toBeInTheDocument();
    });
});
