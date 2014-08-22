# Read about factories at https://github.com/thoughtbot/factory_girl
require 'faker'

FactoryGirl.define do
  factory :step do
    title Faker::Lorem.sentence
    category "General"
    text Faker::Lorem.paragraph
    continue_btn_text Faker::Lorem.sentence(2)
    is_default false
  end
end
