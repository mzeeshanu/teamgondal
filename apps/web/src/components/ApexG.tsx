type Props = {
  size?: number;
  className?: string;
  /** Draws the dark circular badge behind the G. */
  badge?: boolean;
};

/** The Team Gondal Apex G mark: a G drawn as a corner with a kerb on the apex. */
export function ApexG({ size = 40, className, badge = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Team Gondal"
    >
      {badge && <circle cx="100" cy="100" r="96" fill="#15181D" stroke="#2A2F37" strokeWidth="2" />}
      <path d="M143.8 56.2 A62 62 0 1 0 162 100" fill="none" stroke="#FFD100" strokeWidth="26" />
      <rect x="100" y="89" width="75" height="22" fill="#FFD100" />
      <path d="M130.4 69.6 A43 43 0 0 0 59.6 114.7" fill="none" stroke="#FFFFFF" strokeWidth="8" />
      <path
        d="M130.4 69.6 A43 43 0 0 0 59.6 114.7"
        fill="none"
        stroke="#1E6BFF"
        strokeWidth="8"
        strokeDasharray="9 9"
      />
    </svg>
  );
}
