
export interface Props {
    /**
     * Optional additional class names
     */
    className?: string,
    /**
     * The Material Icon to display
     */
    icon: string,
    /**
     * The color to render
     */
    color: 'info' | 'success' | 'danger',
    /**
     * The header text to display
     */
    header: string,
    /**
     * The body text to display
     */
    body: string,
    /**
     * Optional disabled attribute to disable component
     */
    disabled?: boolean,
    /**
     * Optional fill attribute to fill background color
     */
    fill?: boolean
}
