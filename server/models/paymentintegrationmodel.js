module.exports = (sequelize, DataTypes) => {

const PaymentIntegration = sequelize.define("PaymentIntegration",{

id:{
type:DataTypes.INTEGER,
primaryKey:true,
autoIncrement:true
},

providerCode:{
type:DataTypes.STRING,
allowNull:false
},

status:{
type:DataTypes.STRING,
defaultValue:"enabled"
},

testMode:{
type:DataTypes.BOOLEAN,
defaultValue:true
},

currency:{
type:DataTypes.STRING,
defaultValue:"USD"
},

merchantId:DataTypes.STRING,

profileId:DataTypes.STRING,

accessKey:DataTypes.TEXT,

secretKey:DataTypes.TEXT,

successUrl:DataTypes.STRING,

cancelUrl:DataTypes.STRING,

transactionType:{
type:DataTypes.STRING,
defaultValue:"sale"
},

skipReview:{
type:DataTypes.BOOLEAN,
defaultValue:true
},

allowRetry:{
type:DataTypes.BOOLEAN,
defaultValue:false
}

},{
tableName:"paymentintegrations",
timestamps:true
});

return PaymentIntegration;

};