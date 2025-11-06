import { render } from "@testing-library/react";
import { CompletedIcon, DeleteIcon, FavoriteIcon } from "..";

describe("<CompletedIcon />", () => {
  it("renders <GoCheck /> when isCompleted is true", () => {
    const { asFragment } = render(<CompletedIcon isCompleted={true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders <GoDash /> when isCompleted is false", () => {
    const { asFragment } = render(<CompletedIcon isCompleted={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("<FavoriteIcon />", () => {
  it("renders <MdFavorite /> when isFavorite is true", () => {
    const { asFragment } = render(<FavoriteIcon isFavorite={true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders <MdOutlineFavoriteBorder /> when isFavorite is false", () => {
    const { asFragment } = render(<FavoriteIcon isFavorite={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("<DeleteIcon />", () => {
  it("renders <GoAlert /> when isHouver is true", () => {
    const { asFragment } = render(<DeleteIcon isHouver={true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders <GoTrash /> when isHouver is false", () => {
    const { asFragment } = render(<DeleteIcon isHouver={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
