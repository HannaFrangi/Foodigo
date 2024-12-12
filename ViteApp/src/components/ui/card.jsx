export const Card = ({ children, className }) => (
  <div className={`p-4 border rounded-lg ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className }) => (
  <div className={`border-b p-4 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
