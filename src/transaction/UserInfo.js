import { Chip, Grid, LinearProgress, Typography } from "@material-ui/core";
import { shallowEqual, useSelector } from "react-redux";

export const UserInfo = ({ tokenDetails }) => {
  const user = useSelector((state) => state.auth.user, shallowEqual);

  return user.address && tokenDetails.symbol ? (
    <Grid>
      <Grid item>
        <Typography variant="h6" color="secondary">
          Address:
        </Typography>
      </Grid>
      <Grid item>
        <Chip label={user.address} />
      </Grid>
      <Grid item>
        <Typography variant="h6" color="secondary">
          Balance (BNB):
        </Typography>
      </Grid>
      <Grid item>
        <Chip label={`${user.balance / Math.pow(10, 18)}`} />
      </Grid>
      <Grid item>
        <Typography variant="h6" color="secondary">
          Balance ({tokenDetails.symbol}):
        </Typography>
      </Grid>
      <Grid item>
        <Chip
          label={`${user.tokenBalance / Math.pow(10, tokenDetails.decimals)}`}
        />
      </Grid>
    </Grid>
  ) : (
    <>
      <Typography variant="caption">Loading User Info...</Typography>
      <LinearProgress />
    </>
  );
};
