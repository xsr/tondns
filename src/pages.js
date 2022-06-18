import React from "react"
import axios from "axios"
import lodash from "lodash"
import {Tab, List, ListItem, ListItemAvatar, ListItemText, Divider, AppBar, Toolbar, AlertTitle, Icon, Avatar, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, TextField, SvgIcon, Alert, LinearProgress, Box, Button, Container, Grid, Paper, Stack, Link as Href} from "@mui/material"
import {ArrowUpward, ArrowDownward} from "@mui/icons-material"
import {useTheme} from "@mui/material/styles"
import {LoadingButton, TabContext, TabList, TabPanel} from "@mui/lab"
import {useAccount, useDNSOwner, useDDNS} from "./index"
import {Link, useNavigate, useParams} from "react-router-dom"
import dayjs from "dayjs"
import {useForm, Controller} from "react-hook-form"
import TonWeb from "tonweb"

window.TonWeb = TonWeb

export const
  Auction = ({address, owner, q}) => {
    const
      [isdeployed, setisdeployed] = React.useState(false),
      [info, setinfo] = React.useState(false),
      [loaded, setloaded] = React.useState(false),
      refresh = async () => {
        let data = await owner.contract.getAuctionAddress(address)
        let datainfo = await owner.contract.getAddressInfo(data.toString())
        setinfo(datainfo)
        setisdeployed(datainfo.state !== "uninitialized")
        console.log('datainfo', datainfo)
        setloaded(true)
      },
      deploy = async () => {
        let ret = await owner.contract.deployAuction(q)
        console.log("ret", ret)
      }
    React.useEffect(() => {
      refresh()
    }, [address])
    return <Box>
      {(loaded && (! isdeployed)) && <Box>
        Auction uninitialized, you may
        <Button variant="contained" onClick={deploy}>Deploy</Button>
      </Box>}
    </Box>
  },
  DNS = ({address, owner, q}) => {
    const
      ddns = useDDNS(address),
      [isavailable, setisavailable] = React.useState(false),
      [info, setinfo] = React.useState(false),
      [loaded, setloaded] = React.useState(false),
      refresh = async () => {
        let init
        try {
          init = await ddns.contract.isInit()
        }
        catch (error) {
          // console.trace(error)
          setinfo({error: String(error?.message)})
        }
        if (! init) {
          setisavailable(true)
        }
        setloaded(true)
      }
    React.useEffect(() => {
      refresh()
    }, [address])
    return <>
      {(! loaded) && <LinearProgress />}
      {loaded && <>
      <Box>DNS for {q}</Box>
      {isavailable && <Box>Domain is free...</Box>}
      {isavailable && <Auction address={address} owner={owner} q={q} />}
      </>}
    </>
  },
  Index = () => {
    const
      theme = useTheme(),
      herosrc_ = "https://i0.wp.com/www.namecheap.com/blog/wp-content/uploads/2022/05/EasyWP-5th-birthday-journey-clouds-1-cover.png?quality=100",
      herosrc = "https://i0.wp.com/www.namecheap.com/blog/wp-content/uploads/2022/05/Blog.png?quality=100",
      navigate = useNavigate(), account = useAccount(),
      searchForm = useForm({defaultValues: {q: ""}}),
      EQDDNS = ("0QCSjN8t09R2BB17GMmlwfROti4xqLbZBmynPZN3ji6paFHT"),
      ddns = useDDNS(EQDDNS),
      EQDNSOWNER = ("0QDbvAbsX5SSrEJxuHeYJ1xjynTrR5er-XFsC1FMJZOZK6L8"),
      owner = useDNSOwner(EQDNSOWNER),
      [address, setaddress] = React.useState(false),
      [q, setq] = React.useState(""),
      search = async data => {
        setq(data.q)
        setaddress(await ddns.contract.getNftAddressByName(data.q))
      },
      nil = null
    return <>
      <Container>
        <Box sx={{mt: 2, display: "flex", flexDirection: "column", justifyContent: "center", textShadow: "2px 2px 4px rgba(0, 0, 0, .5)", alignItems: "center", color: theme.palette.grey["50"], p: 2, width: 1, height: "56vh", backgroundImage: `url(${herosrc})`, backgroundSize: "cover"}}>
          <Box sx={{mt: 2, typography: "h1"}}>TONDNS</Box>
          <Box sx={{mt: 0, typography: "h5"}}>@DDNS</Box>
          <Box sx={{mt: 0, typography: "caption", fontFamily: "Roboto Mono"}}>{EQDDNS}</Box>
          <Box sx={{mt: 0, typography: "h5"}}>@DNSOWNER</Box>
          <Box sx={{mt: 0, typography: "caption", fontFamily: "Roboto Mono"}}>{EQDNSOWNER}</Box>
        </Box>
        <Box sx={{mt: 2}}>
          <form onSubmit={searchForm.handleSubmit(search)}>
          <Box sx={{display: "flex", alignItems: "center"}}>
            <Box sx={{flexGrow: 1}}>
              <Controller
                name="q"
                control={searchForm.control}
                rules={{validate: async value => value.length > 2 || "Query is too short..."}}
                render={({field}) => <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  label="Query"
                  helperText={searchForm.formState.errors.q?.message}
                  error={!! searchForm.formState.errors.q}
                 />}
               />
            </Box>
            <Box>
              <Button type="submit" variant="contained" sx={{ml: 2}}>
                Search
              </Button>
            </Box>
          </Box>
          </form>
        </Box>
        {address && <DNS address={address.toString()} owner={owner} q={q} />}
        <Box sx={{mt: 4, textAlign: "center", typography: "caption"}}>TonWeb.version: {TonWeb.version}</Box>
      </Container>
    </>
  }