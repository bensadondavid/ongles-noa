declare namespace JSX {
  interface IntrinsicElements {
    "l-tailspin": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      size?: string | number
      stroke?: string | number
      speed?: string | number
      color?: string
    }
  }
}