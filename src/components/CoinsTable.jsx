import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CryptoState } from '../ContextApi';
import { CoinList } from "../apis/api";
import { createTheme, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography } from "@mui/material";
import { Container } from '@mui/system';
// import { red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import "./CoinsTable.css";

function CoinsTable() {

    const [coins, setCoins] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState();

    const [currdata,setCurrdata]=useState(coins);



    const navigate = useNavigate();

    const { currency } = CryptoState();
    //destructing currency from CryptoState

    const fetchCoins = async () => {
        setLoading(true);
        const { data } = await axios.get(CoinList(currency));

        setCoins(data);
        setCurrdata(coins);
        setLoading(false);
    };

    console.log(coins);

    useEffect(() => {
        fetchCoins();
    }, [currency]);

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        },
    });

    const handleSearch = () => {
        setCurrdata( coins.filter((coin) =>
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toLowerCase().includes(search)
          )  )
    }

    //we will compare th einput text by name as well as symbol 
    //we will include handlesearch in TableBody so that we will get filtered coins

    return (
        <ThemeProvider theme={darkTheme}>
            <Container style={{ textAlign: "center" }}>
                <Typography
                    variant="h4"
                    style={{ margin: 18 }}
                >
                    Cryptocurrency Prices by Market Cap
                </Typography>

                <TextField
                    label="Search For a Crypto Currency"
                    variant='outlined'
                    sx={{ "& label": { color: "white" } }}
                    style={{ marginBottom: 20, width: "100%", color: "green", }}
                    InputProps={{ style: { color: "white" } }}
                    onChange={(e) => {setSearch(e.target.value)
                        handleSearch();
                    }}
                >

                </TextField>

                <TableContainer>
                    {
                        loading ? (
                            <LinearProgress style={{ backgroundColor: "purple" }} />
                        ) : (
                            <Table>
                                <TableHead style={{ backgroundColor: "purple" }}>
                                    <TableRow>

                                        {/* in TableRoww have array of Coin Price 24th... and Market Cap and we gonna map on this with variable head and we gonna render 5 tablecells listed below */}

                                        {["Coin", "Price", "24th Change", "Market Cap"].map((head) => (
                                            <TableCell
                                                style={{
                                                    color: "black",
                                                    fontWeight: "700"
                                                }}
                                                key={head}
                                                align={head === "Coin" ? "" : "right"}
                                            >
                                                {head}
                                            </TableCell>
                                        ))}

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currdata.map((row) => {
                                        const profit = row.price_change_percentage_24h > 0;
                                        return (
                                            <TableRow
                                                onClick={() => navigate.push(`/coins/${row.id}`)}
                                                className="row"
                                                key={row.name}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    // role="cell"
                                                    // height="100px"
                                                    styles={{
                                                        display: "flex",
                                                        gap: 15,
                                                    }}
                                                >
                                                    <img
                                                        src={row?.image}
                                                        alt={row.name}
                                                        height="50"
                                                        style={{ marginBottom: 10 }}
                                                    />
                                                   
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )
                    }
                </TableContainer>
            </Container>
        </ThemeProvider>
    )
}

export default CoinsTable