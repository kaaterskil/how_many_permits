# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :response do
    title Faker::Lorem.sentence
    text Faker::Lorem.paragraph
    required_permit Faker::Lorem.sentence
    result_text Faker::Lorem.sentence
    result_resources Faker::Lorem.paragraph
  end
end
