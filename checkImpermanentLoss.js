const config = require("./utils/config.json")
const id = config.id;
const TICK_BASE = 1.0001;
const GRAPHQL_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

function tick_to_price(tick){
    return TICK_BASE ** tick
}
// script that will be running and querying uniswap v3 subgraph to fetch positions info & pool tick to calculate impermanent loss
const checkImpermanentLoss = async() => {
    try{
        let POSITION_ID = id;

        // if passed in command line, use an alternative pool ID
        // console.log("argv: ", process.argv)
        if (process.argv.length > 2)
            {POSITION_ID = process.argv[2]}



        const position_query = `
        query get_position($position_id: ID!) {
            positions(where: {id: $position_id}) {
                liquidity
                tickLower { tickIdx }
                tickUpper { tickIdx }
                pool { id }
                token0 {
                symbol
                decimals
                }
                token1 {
                symbol
                decimals
                }
            }
        }`;

        // return the tick and the sqrt of the current price
        const pool_query = `
        query get_pools($pool_id: ID!) {
            pools(where: {id: $pool_id}) {
                tick
                sqrtPrice
            }
        }`;


        try {
            const position_variables = {"position_id": POSITION_ID}
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Node'
                },
                body: JSON.stringify({ query: position_query, variables: position_variables })
              };
    
            let body;
            let response;
    
            response = await fetch(GRAPHQL_ENDPOINT, options);
            body = await response.json();
            const positions = body.data.positions;
            console.log("positions is: ", positions);

            if (positions.length == 0){
                console.log("position not found")
                return
            }

            position = positions[0]
            // console.log("------",position["tickLower"]["tickIdx"], Number(position["tickLower"]["tickIdx"]), parseInt(position["tickLower"]["tickIdx"]), Number.parseInt(position["liquidity"]))
            liquidity = position["liquidity"]
            tick_lower = Number(position["tickLower"]["tickIdx"])
            tick_upper = Number(position["tickUpper"]["tickIdx"])
            pool_id = position["pool"]["id"]

            token0 = position["token0"]["symbol"]
            token1 = position["token1"]["symbol"]
            decimals0 = position["token0"]["decimals"]
            decimals1 = position["token1"]["decimals"]

            if (body.errors){console.log("Error in fetching position_query: ",body.errors)};
          } catch (error) {
            console.log("Error in fetching position_query: ",error)
          }

        console.log("pool id=", pool_id)

        // get pool info for current price
        try{
           const pool_variables = {"pool_id": pool_id}
           const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Node'
            },
            body: JSON.stringify({ query: pool_query, variables: pool_variables })
            };
            let body;
            let response;
    
            response = await fetch(GRAPHQL_ENDPOINT, options);
            body = await response.json();
            console.log("pools is: ", body.data.pools)
            const pools = body.data.pools;
            // response = client.execute(gql(pool_query), variable_values=variables)

            if (pools.length == 0){
                console.log("pool not found")
                return
            }

            pool = pools[0]
            current_tick = Number(pool["tick"])
            current_sqrt_price = pool["sqrtPrice"] / (2 ** 96)
            console.log("current tick and current sqrt price: ", current_tick, current_sqrt_price)
        }catch(err){
            console.log("got exception while querying pool data:", err);
        }
        // Compute and print the current price
        current_price = tick_to_price(current_tick)
        adjusted_current_price = current_price / (10 ** (decimals1 - decimals0))
        // print("Current price={:.6f} {} for {} at tick {}".format(adjusted_current_price, token1, token0, current_tick))
        console.log("Current price=", adjusted_current_price,",  ", token1," for ", token0, " at tick: ",current_tick);

        sa = tick_to_price(tick_lower / 2)
        sb = tick_to_price(tick_upper / 2)
        console.log("xxxx: ", tick_lower, tick_upper, current_tick, sb-current_sqrt_price, current_sqrt_price*sb);
        if (tick_upper <= current_tick)
            // Only token1 locked
            {
                console.log("Only token1 locked");
                amount0 = 0
                amount1 = liquidity * (sb - sa)
            }
        else if ((tick_lower < current_tick) && (current_tick < tick_upper))
            // Both tokens present
            {
                console.log("Both tokens present");
                amount0 = liquidity * (sb - current_sqrt_price) / (current_sqrt_price * sb)
                amount1 = liquidity * (current_sqrt_price - sa)
            }
        else
            // Only token0 locked
            {
                console.log("Only token0 locked");
                amount0 = liquidity * (sb - sa) / (sa * sb)
                amount1 = 0
            }


        // print info about the position
        adjusted_amount0 = amount0 / (10 ** decimals0)
        adjusted_amount1 = amount1 / (10 ** decimals1)

        console.log("Position: ", POSITION_ID, " in range [",tick_lower,", ",tick_upper,"] : ", adjusted_amount0, token0, " and ", adjusted_amount1, token1, "at the current price");
        let loss;
        if(adjusted_amount0 > adjusted_amount1){
            loss = adjusted_amount1/adjusted_amount0;
        }else if (adjusted_amount0 < adjusted_amount1) {
            loss = adjusted_amount0 / adjusted_amount1;
        }

        console.log("loss: ", loss)
        return loss;
    }catch(err){
        console.log("error: ", err);
    }
}

module.exports = {checkImpermanentLoss}