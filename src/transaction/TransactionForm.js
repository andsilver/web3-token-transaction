import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { contract, isAddress, web3 } from "../helper/web3";
import {
  addTransaction,
  updateTransaction,
} from "../store/reducers/transaction";

export const TransactionForm = ({ tokenDetails, onTransactionFinish }) => {
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    receiver: "",
    amount: 0,
  });
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const dispatch = useDispatch();
  const styles = useStyles();

  useEffect(() => {
    const errors = {};

    if (!form.receiver) {
      errors.receiver = "The receiver is required";
    } else if (!isAddress(form.receiver)) {
      errors.receiver = "The address is not valid";
    }

    if (!form.amount) {
      errors.amount = "Amount is required";
    } else if (form.amount < 0) {
      errors.amount = "Amount should be an integer";
    }
    setErrors(errors);
  }, [form]);

  const updateForm = (value) => {
    setShowErrors(false);
    setForm({ ...form, ...value });
  };

  const transfer = () => {
    if (Object.keys(errors).length) {
      return setShowErrors(true);
    }
    const { amount, receiver } = form;
    const unit = web3.utils.toBN(10 ** tokenDetails.decimals);
    const value = web3.utils.toBN(amount);

    contract.methods
      .transfer(receiver, value.mul(unit))
      .send({ from: user.address })
      .on("transactionHash", (transactionHash) => {
        dispatch(
          addTransaction({ ...form, transactionHash, status: "loading" })
        );
      })
      .on("error", (_, receipt) => {
        if (!receipt) {
          return;
        }
        onTransactionFinish();
        dispatch(
          updateTransaction({
            transactionHash: receipt.transactionHash,
            status: "error",
          })
        );
      })
      .then((res) => {
        onTransactionFinish();
        dispatch(
          updateTransaction({
            transactionHash: res.transactionHash,
            status: "success",
          })
        );
      });
  };

  return (
    <Card className={styles.card}>
      <CardContent>
        <Typography variant="h5" gutterBottom={true}>
          {tokenDetails?.symbol
            ? `Transfer ${tokenDetails.symbol}`
            : "Loading Token Info..."}
        </Typography>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <FormControl
              color="secondary"
              error={!!errors.receiver && showErrors}
              fullWidth
            >
              <InputLabel>Receiver</InputLabel>
              <Input
                value={form.receiver}
                onChange={(e) => updateForm({ receiver: e.target.value })}
              ></Input>
              {!!errors.receiver && showErrors && (
                <FormHelperText error>{errors.receiver}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl
              color="secondary"
              error={!!errors.amount && showErrors}
              fullWidth
            >
              <InputLabel>Amount</InputLabel>
              <Input
                value={form.amount}
                type="number"
                onChange={(e) => updateForm({ amount: e.target.value })}
                endAdornment={
                  <InputAdornment position="end">
                    <Button
                      onClick={() =>
                        updateForm({
                          amount:
                            +user.tokenBalance /
                            Math.pow(10, +tokenDetails.decimals),
                        })
                      }
                    >
                      MAX
                    </Button>
                  </InputAdornment>
                }
              ></Input>
              {showErrors && !!errors.amount && (
                <FormHelperText error>{errors.amount}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              disabled={!user.address}
              color="secondary"
              variant="contained"
              onClick={() => transfer()}
            >
              Transfer
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles(() => ({
  card: {
    marginTop: 36,
  },
}));
