import {
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Link,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import LaunchIcon from "@material-ui/icons/Launch";

export const TransactionList = () => {
  const transactions = useSelector((state) => state.transaction.all);
  const headers = [
    {
      label: "TxHash",
      field: "transactionHash",
    },
    { label: "To", field: "receiver" },
    { label: "Amount", field: "amount" },
    { label: "Status", field: "status" },
  ];
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          Your Transfers
        </Typography>
        {transactions?.length ? (
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((h) => (
                  <TableCell key={h.field}>{h.label} </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.transactionHash}>
                  <TableCell>
                    <Link
                      color="textPrimary"
                      href={`https://testnet.bscscan.com/tx/${t.transactionHash}`}
                      target="_blank"
                    >
                      {t.transactionHash.substr(0, 8)}...
                      {t.transactionHash.substr(-4)}
                      <IconButton size="small">
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      color="textPrimary"
                      href={`https://testnet.bscscan.com/address/${t.receiver}`}
                      target="_blank"
                    >
                      {t.receiver.substr(0, 8)}...
                      {t.receiver.substr(-4)}
                      <IconButton size="small">
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Chip label={t.amount} />
                  </TableCell>
                  <TableCell>
                    {t.status === "loading" ? (
                      <LinearProgress />
                    ) : (
                      <Chip
                        color={
                          {
                            error: "secondary",
                            success: "primary",
                          }[t.status]
                        }
                        label={t.status.toUpperCase()}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="caption">No records</Typography>
        )}
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles(() => ({
  card: {
    marginTop: 36,
    marginBottom: 36,
  },
}));
