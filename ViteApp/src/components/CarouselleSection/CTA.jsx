import { Link } from "react-router-dom";

export const CTA = ({
  text = "Find your recipes",
  classes,
  path = "/favorites",
}) => {
  const buttonClasses = `cta justify-start sm:justify-center lg:justify-start ${classes}`;
  return (
    <>
      <button className={buttonClasses}>
        <Link to={path} className="btn btn-3 text-lg">
          <span className="btn-border"></span>
          <span className="btn-ripple">
            <span></span>
          </span>
          <span className="btn-title">
            <span data-text={text}>{text}</span>
          </span>
        </Link>
      </button>
    </>
  );
};
