import {
  Button,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Web3 from "web3";
import { useMetaMask } from "metamask-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  getAccountBalance,
  getTokenBalance,
  getTokenDecimal,
  getTokenSymbol,
  web3,
} from "../helper/web3";
import { setUser } from "../store/reducers/auth";
import { TransactionForm } from "./TransactionForm";
import { UserInfo } from "./UserInfo";
import { TransactionList } from "./TransactionList";

export const Transaction = () => {
  const { connect, account } = useMetaMask();
  const styles = useStyles();
  const dispatch = useDispatch();
  const [tokenDetails, setTokenDetails] = useState({});

  const setUserInfo = useCallback(
    () =>
      Promise.all([getAccountBalance(account), getTokenBalance(account)]).then(
        ([balance, tokenBalance]) => {
          console.log(tokenBalance);
          dispatch(
            setUser({
              address: account,
              balance: balance.toString(),
              tokenBalance,
            })
          );
        }
      ),
    [dispatch, account]
  );

  useEffect(() => {
    Promise.all([getTokenDecimal(), getTokenSymbol()]).then(
      ([decimals, symbol]) => {
        setTokenDetails({ decimals: +decimals, symbol });
      }
    );
  }, []);

  useEffect(() => {
    if (!account) {
      dispatch(
        setUser({
          address: null,
          balance: 0,
          tokenBalance: 0,
        })
      );
    } else {
      web3.eth.setProvider(Web3.givenProvider);
      setUserInfo();
    }
  }, [account, dispatch, setUserInfo]);

  return (
    <Grid className={styles.pageContainer}>
      <Typography gutterBottom variant="h4" component="h2">
        Web3 - Transaction Track
      </Typography>
      <Card className={styles.card}>
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between">
            <Typography gutterBottom variant="h5" component="h2">
              Wallet Info
            </Typography>
            {!account && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => connect()}
              >
                Connect Metamask
              </Button>
            )}
          </Grid>
          {account && <UserInfo tokenDetails={tokenDetails} />}
        </CardContent>
      </Card>
      {account && (
        <>
          <TransactionForm
            tokenDetails={tokenDetails}
            onTransactionFinish={setUserInfo}
          />
          <TransactionList />
        </>
      )}
    </Grid>
  );
};

const useStyles = makeStyles(() => ({
  pageContainer: {
    paddingTop: 36,
    paddingBottom: 36,
  },
  card: {
    marginTop: 36,
  },
}));
